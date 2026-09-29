import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const require = createRequire(path.join(rootDir, 'package.json'));

const parser = require('@babel/parser');
const traverseModule = require('@babel/traverse');
const traverse = traverseModule.default || traverseModule;

const globalAllowList = new Set([
  'window', 'document', 'console', 'localStorage', 'sessionStorage',
  'fetch', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'Date', 'Math', 'Number', 'String', 'Boolean', 'Array', 'Object', 'Set', 'Map',
  'JSON', 'Promise', 'Error', 'RegExp', 'isNaN', 'parseInt', 'parseFloat',
  'encodeURIComponent', 'decodeURIComponent', 'btoa', 'atob', 'alert', 'confirm',
  'prompt', 'URL', 'Blob', 'FileReader', 'FormData', 'Event', 'CustomEvent',
  'navigator', 'location', 'history', 'requestAnimationFrame', 'cancelAnimationFrame',
  'Intl', 'Infinity', 'undefined', 'NaN', 'HTMLElement', 'HTMLInputElement', 'HTMLDivElement',
  'Element', 'Node', 'File', 'FileList', 'Headers', 'Request', 'Response', 'process'
]);

let errorCount = 0;

function scanFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    const undeclared = new Set();
    traverse(ast, {
      Program(p) {
        p.traverse({
          ReferencedIdentifier(identPath) {
            const name = identPath.node.name;
            if (globalAllowList.has(name)) return;
            if (!identPath.scope.hasBinding(name)) {
              undeclared.add(name);
            }
          }
        });
      }
    });

    if (undeclared.size > 0) {
      console.error(`❌ [${path.relative(rootDir, filePath)}]: Undeclared identifier(s) -> ${Array.from(undeclared).join(', ')}`);
      errorCount++;
    }
  } catch (err) {
    console.error(`❌ [${path.relative(rootDir, filePath)}]: Syntax error: ${err.message}`);
    errorCount++;
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      scanFile(full);
    }
  }
}

const srcDir = path.join(rootDir, 'src');
console.log(`🔍 Scanning all JS/JSX files in ${srcDir}...`);
scanDir(srcDir);

if (errorCount === 0) {
  console.log('✅ All JSX/JS files in src/ passed syntax and undeclared identifier checks!');
  process.exit(0);
} else {
  console.error(`❌ Found ${errorCount} file(s) with undeclared identifiers or syntax errors.`);
  process.exit(1);
}
