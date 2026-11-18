#!/usr/bin/env sh
# Writes scripts/e2e/tokens.json: one 8-hour login token per role, signed inside the backend
# container (which holds JWT_SECRET), for the first user of each role (real users preferred
# over test_* users). The file is gitignored; tokens are never printed.
# Run from the repo root with the dev stack up:  sh scripts/e2e/mint-tokens.sh
set -e
OUT="$(dirname "$0")/tokens.json"
docker-compose exec -T backend node --input-type=module -e "
import jwt from 'jsonwebtoken';
import pg from 'pg';
const p = new pg.Pool({ host: 'db', user: 'postgres', password: 'postgres', database: 'erp_db' });
const { rows } = await p.query(\"SELECT DISTINCT ON (role) id, username, email, role FROM users ORDER BY role, (username LIKE 'test_%'), id\");
const out = {};
for (const u of rows) out[u.role] = { user: u, token: jwt.sign({ id: u.id, username: u.username, role: u.role }, process.env.JWT_SECRET, { expiresIn: '8h' }) };
console.log(JSON.stringify(out));
await p.end();" > "$OUT"
node -e "console.log('tokens for: ' + Object.keys(require(require('path').resolve(process.argv[1]))).join(', '))" "$OUT"
