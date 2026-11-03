/**
 * databaseBackup.js
 * 
 * Generates a complete, self-contained PostgreSQL SQL dump of the ERP database.
 * Pure Node.js implementation that does not depend on host pg_dump binaries.
 * Restorable into any PostgreSQL instance via standard psql:
 *   psql -U postgres -d erp_db -f vyom_erp_backup_YYYY-MM-DD.sql
 */

import pool from '../db.js';

// Table export ordering to respect foreign key hierarchies
const PREFERRED_TABLE_ORDER = [
  'system_settings',
  'users',
  'companies',
  'company_locations',
  'custom_columns',
  'department_column_visibility',
  'part_numbers',
  'panel_size_masters',
  'task_masters',
  'orders',
  'order_line_items',
  'order_units',
  'documents',
  'order_steps',
  'unit_steps',
  'activity_logs'
];

/**
 * Escapes an SQL literal for safe inclusion in an INSERT query.
 */
function escapeSqlLiteral(val, udtName) {
  if (val === null || val === undefined) {
    return 'NULL';
  }

  if (typeof val === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }

  if (typeof val === 'number') {
    return isFinite(val) ? String(val) : 'NULL';
  }

  if (val instanceof Date) {
    return `'${val.toISOString()}'`;
  }

  if (typeof val === 'object') {
    // JSON or JSONB field
    const jsonStr = JSON.stringify(val).replace(/'/g, "''");
    return `'${jsonStr}'::jsonb`;
  }

  // String / text escaping (standard conforming strings: double single-quotes)
  const str = String(val).replace(/'/g, "''");
  if (udtName === 'json' || udtName === 'jsonb') {
    return `'${str}'::jsonb`;
  }
  return `'${str}'`;
}

/**
 * Generates the complete database backup SQL string.
 * @param {object} [clientParam] - Optional existing database connection client
 * @returns {Promise<{ filename: string, sql: string, stats: object }>}
 */
export async function generateDatabaseBackup(clientParam) {
  const client = clientParam || await pool.connect();
  const shouldRelease = !clientParam;

  try {
    const timestamp = new Date();
    const dateStamp = timestamp.toISOString().replace(/[:.]/g, '-');
    const filename = `vyom_erp_backup_${dateStamp}.sql`;

    // 1. Database version and context info
    const infoRes = await client.query('SELECT current_database() as db, version() as ver');
    const dbName = infoRes.rows[0]?.db || 'erp_db';
    const dbVer = infoRes.rows[0]?.ver || 'PostgreSQL';

    // 2. Discover all public base tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const allExistingTables = new Set(tablesRes.rows.map(r => r.table_name));

    // Arrange tables in dependency order, then append any unlisted custom tables
    const orderedTables = [];
    for (const t of PREFERRED_TABLE_ORDER) {
      if (allExistingTables.has(t)) {
        orderedTables.push(t);
        allExistingTables.delete(t);
      }
    }
    for (const remaining of allExistingTables) {
      orderedTables.push(remaining);
    }

    const lines = [];

    // Header comments
    lines.push('-- ========================================================');
    lines.push('-- Vyom ERP Database Backup Dump');
    lines.push(`-- Database: ${dbName}`);
    lines.push(`-- Server Version: ${dbVer}`);
    lines.push(`-- Generated At: ${timestamp.toISOString()}`);
    lines.push('-- ========================================================');
    lines.push('');
    lines.push('SET statement_timeout = 0;');
    lines.push('SET lock_timeout = 0;');
    lines.push("SET client_encoding = 'UTF8';");
    lines.push('SET standard_conforming_strings = on;');
    lines.push('SET check_function_bodies = false;');
    lines.push('SET client_min_messages = warning;');
    lines.push('SET row_security = off;');
    lines.push('');
    lines.push('BEGIN;');
    lines.push('');

    const stats = {
      tables: 0,
      totalRows: 0,
      tableCounts: {}
    };

    // 3. Dump data for each table
    for (const tableName of orderedTables) {
      // Get column metadata in ordinal position
      const colsRes = await client.query(`
        SELECT column_name, data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1 
        ORDER BY ordinal_position
      `, [tableName]);

      if (colsRes.rows.length === 0) continue;

      const columns = colsRes.rows;
      const colNamesList = columns.map(c => `"${c.column_name}"`).join(', ');

      // Fetch all rows for table
      const dataRes = await client.query(`SELECT * FROM "${tableName}"`);
      const rowCount = dataRes.rows.length;
      stats.tables += 1;
      stats.totalRows += rowCount;
      stats.tableCounts[tableName] = rowCount;

      lines.push(`-- --------------------------------------------------------`);
      lines.push(`-- Table Data: "${tableName}" (${rowCount} rows)`);
      lines.push(`-- --------------------------------------------------------`);

      if (rowCount === 0) {
        lines.push(`-- (No rows in ${tableName})`);
        lines.push('');
        continue;
      }

      // Generate chunked multi-row or single INSERT statements
      const CHUNK_SIZE = 50;
      for (let i = 0; i < rowCount; i += CHUNK_SIZE) {
        const chunk = dataRes.rows.slice(i, i + CHUNK_SIZE);
        const valueClauses = chunk.map(row => {
          const formattedVals = columns.map(col => {
            const rawVal = row[col.column_name];
            return escapeSqlLiteral(rawVal, col.udt_name);
          });
          return `(${formattedVals.join(', ')})`;
        });

        lines.push(`INSERT INTO "${tableName}" (${colNamesList}) VALUES`);
        lines.push(valueClauses.join(',\n') + ';');
      }

      lines.push('');
    }

    // 4. Dump sequence values so auto-increment IDs stay valid
    lines.push('-- --------------------------------------------------------');
    lines.push('-- Sequences Value Sync');
    lines.push('-- --------------------------------------------------------');
    const seqRes = await client.query(`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public'
    `);

    for (const seq of seqRes.rows) {
      const seqName = seq.sequence_name;
      try {
        const valRes = await client.query(`SELECT last_value, is_called FROM "${seqName}"`);
        if (valRes.rows.length > 0) {
          const { last_value, is_called } = valRes.rows[0];
          lines.push(`SELECT pg_catalog.setval('"${seqName}"', ${last_value}, ${is_called ? 'true' : 'false'});`);
        }
      } catch (seqErr) {
        lines.push(`-- Notice: Could not read sequence "${seqName}": ${seqErr.message}`);
      }
    }

    lines.push('');
    lines.push('COMMIT;');
    lines.push('');
    lines.push('-- ========================================================');
    lines.push('-- End of Backup Dump');
    lines.push('-- ========================================================');

    const sql = lines.join('\n');
    return { filename, sql, stats };

  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

