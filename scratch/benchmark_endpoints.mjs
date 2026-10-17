import jwt from 'jsonwebtoken';

async function main() {
  const token = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, 'supersecret', { expiresIn: '1d' });
  console.log('Signed token:', !!token);

  const endpoints = [
    '/api/orders/1',
    '/api/orders/1/steps',
    '/api/units/1/steps',
    '/api/task_masters',
    '/api/board',
    '/api/dept-worklist/Purchase'
  ];

  for (const ep of endpoints) {
    const t0 = performance.now();
    const res = await fetch(`http://localhost:5000${ep}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const ms = (performance.now() - t0).toFixed(1);
    const size = Array.isArray(data) ? `Array(${data.length})` : typeof data === 'object' ? `Object(${Object.keys(data).length} keys)` : typeof data;
    console.log(`${ep.padEnd(30)} -> ${ms.padStart(6)}ms (${size})`);
  }
}

main().catch(console.error);
