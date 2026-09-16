import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5433/vyom_erp' });

async function check() {
  const idxRes = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'documents'");
  console.log('Documents indexes:', idxRes.rows);
  const uIdxRes = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'order_units'");
  console.log('Order_units indexes:', uIdxRes.rows.map(r => r.indexname));
  await pool.end();
}
check();
