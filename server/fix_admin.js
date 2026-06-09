import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@db:5432/erp_db' });

bcrypt.hash('admin123', 10)
  .then(hash => pool.query("UPDATE users SET password = $1 WHERE email IN ('admin@vyom.com', 'admin@absolutemotion.in') OR role = 'Admin'", [hash]))
  .then(() => console.log('Password updated successfully for admin user(s)!'))
  .catch(console.error)
  .finally(() => pool.end());
