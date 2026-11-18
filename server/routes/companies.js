import express from 'express';
import { publicErrorMessage } from '../services/httpErrors.js';

/**
 * Router for company masters and their locations (mounted at /api/companies).
 * Read: any logged-in user. Create/update: Admin, Manager, Sales.
 * A location still referenced by an order is never deleted on update.
 */
export default function createCompaniesRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const companies = await pool.query('SELECT * FROM companies ORDER BY name ASC');
      const locations = await pool.query('SELECT * FROM company_locations');

      const result = companies.rows.map(comp => ({
        ...comp,
        locations: locations.rows.filter(l => l.company_id === comp.id)
      }));
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  });

  router.post('/', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    const { name, gst_number, locations } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cleanGst = (typeof gst_number === 'string' && gst_number.trim()) ? gst_number.trim() : null;
      const compRes = await client.query(
        'INSERT INTO companies (name, gst_number) VALUES ($1, $2) RETURNING *',
        [name ? name.trim() : '', cleanGst]
      );
      const company = compRes.rows[0];
      const savedLocations = [];

      if (locations && locations.length > 0) {
        for (const loc of locations) {
          if (!loc.city || !loc.city.trim()) continue;
          const locRes = await client.query(
            `INSERT INTO company_locations (company_id, address, city, person_in_charge, contact_number, email) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [company.id, loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null]
          );
          savedLocations.push(locRes.rows[0]);
        }
      }
      await client.query('COMMIT');
      res.status(201).json({ ...company, locations: savedLocations });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to create company') });
    } finally {
      client.release();
    }
  });

  router.put('/:id', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    const { name, gst_number, locations } = req.body;
    const companyId = req.params.id;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cleanGst = (typeof gst_number === 'string' && gst_number.trim()) ? gst_number.trim() : null;
      const compRes = await client.query(
        `UPDATE companies 
         SET name = COALESCE($1, name), 
             gst_number = $2 
         WHERE id = $3 
         RETURNING *`,
        [name ? name.trim() : null, cleanGst, companyId]
      );
      if (compRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Company not found' });
      }
      const company = compRes.rows[0];

      if (locations && Array.isArray(locations)) {
        const existingLocs = await client.query('SELECT id FROM company_locations WHERE company_id = $1', [companyId]);
        const incomingIds = locations.map(l => l.id).filter(Boolean);

        for (const ex of existingLocs.rows) {
          if (!incomingIds.includes(ex.id)) {
            const orderRef = await client.query('SELECT id FROM orders WHERE company_location_id = $1 LIMIT 1', [ex.id]);
            if (orderRef.rows.length === 0) {
              await client.query('DELETE FROM company_locations WHERE id = $1', [ex.id]);
            }
          }
        }

        const savedLocations = [];
        for (const loc of locations) {
          if (!loc.city || !loc.city.trim()) continue;
          if (loc.id) {
            const locRes = await client.query(
              `UPDATE company_locations 
               SET address = $1, city = $2, person_in_charge = $3, contact_number = $4, email = $5 
               WHERE id = $6 AND company_id = $7 
               RETURNING *`,
              [loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null, loc.id, companyId]
            );
            if (locRes.rows.length > 0) {
              savedLocations.push(locRes.rows[0]);
            }
          } else {
            const locRes = await client.query(
              `INSERT INTO company_locations (company_id, address, city, person_in_charge, contact_number, email) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
              [companyId, loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null]
            );
            savedLocations.push(locRes.rows[0]);
          }
        }
        company.locations = savedLocations;
      } else {
        const locRes = await client.query('SELECT * FROM company_locations WHERE company_id = $1', [companyId]);
        company.locations = locRes.rows;
      }

      await client.query('COMMIT');
      res.json(company);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to update company:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to update company') });
    } finally {
      client.release();
    }
  });

  return router;
}
