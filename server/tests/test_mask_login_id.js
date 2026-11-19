// Login logs must not contain full email addresses or usernames.
//
// The login route logs every attempt. maskLoginId keeps enough to recognise an account in the logs
// (first character and the email domain) and replaces characters that could forge extra log lines.
import assert from 'assert';
import { maskLoginId } from '../services/logPrivacy.js';

const cases = [
  ['someone@gmail.com', 's***@gmail.com', 'email: first character and domain'],
  ['Ab@vyom.co.in', 'A***@vyom.co.in', 'email with a short local part'],
  ['admin', 'a***', 'username: first character only'],
  ['@example.com', '***@example.com', 'empty local part'],
  ['', '(none)', 'empty string'],
  [undefined, '(none)', 'missing'],
  [null, '(none)', 'null'],
  [12345, '(none)', 'not a string'],
  ['x@evil.com\n[LOGIN SUCCESS] Email: "admin"', 'x***@evil.com?[LOGIN?SUCCESS]?Email:?"admin"', 'domain keeps no line break'],
  ['\nadmin', '?***', 'first character keeps no line break']
];

let failures = 0;
for (const [input, expected, label] of cases) {
  const actual = maskLoginId(input);
  try {
    assert.strictEqual(actual, expected);
    console.log(`✓ ${label}: ${JSON.stringify(input)} -> ${actual}`);
  } catch {
    failures++;
    console.error(`✗ ${label}: ${JSON.stringify(input)} -> ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
  }
}

const long = maskLoginId(`a@${'b'.repeat(500)}.com`);
if (long.length > 110) {
  failures++;
  console.error(`✗ a very long domain is not shortened (${long.length} characters)`);
} else {
  console.log(`✓ a very long domain is shortened (${long.length} characters)`);
}

if (failures) {
  console.error(`\n${failures} mask check(s) failed`);
  process.exit(1);
}
console.log('\nALL LOGIN-ID MASKING TESTS PASSED');
