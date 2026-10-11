// Local repository check. Prints only counts and affected paths, never credentials.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const git = args => execFileSync('git', args, { cwd: root, maxBuffer: 16 * 1024 * 1024 });
const files = git(['ls-files', '-z']).toString('utf8').split('\0').filter(Boolean);
const forbidden = files.filter(file => /(^|\/)(node_modules|dist|\.git|\.aws|\.codex|\.vercel)(\/|$)/.test(file)
  || /(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith('.env.example')
  || /(^|\/)\.neon[^/]*$/.test(file) || file.startsWith('docs/archive/'));
const knownValues = [];
for (const relative of ['.env.local', 'app/.env.local']) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
    if (value.length >= 20 && /KEY|TOKEN|SECRET|PASSWORD|DATABASE_URL|CONNECTION_STRING/.test(match[1])) knownValues.push(value);
  }
}
const patterns = [
  /sk-(?:proj-)?[A-Za-z0-9_-]{24,}/,
  /gh[pousr]_[A-Za-z0-9_]{24,}/,
  /github_pat_[A-Za-z0-9_]{24,}/,
  /postgres(?:ql)?:\/\/[^\s:'"]+:[^\s@'"<>]{8,}@/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
const leaks = [];
let checked = 0;
for (const file of files) {
  if (!/\.(?:md|tsx?|[cm]?js|json|html|css|svg|txt|ya?ml|example)$/.test(file) && !/\.(?:gitignore|gitattributes)$/.test(file)) continue;
  const value = git(['show', `:${file}`]).toString('utf8');
  checked++;
  if (patterns.some(pattern => pattern.test(value)) || knownValues.some(secret => value.includes(secret))) leaks.push(file);
}
console.log(JSON.stringify({ trackedFiles: files.length, textFilesChecked: checked, forbiddenPaths: forbidden, possibleSecretPaths: leaks }));
if (forbidden.length || leaks.length) process.exitCode = 1;
