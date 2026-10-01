// Fails when src/ contains a raw color or a Tailwind arbitrary value.
// Raw colors belong in src/styles/tokens.css only. Test files are skipped (they may assert on colors).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = 'src';
const ALLOWED_FILES = new Set([path.join('src', 'styles', 'tokens.css')]);

const RULES = [
  { name: 'hex color', pattern: /#[0-9a-fA-F]{3,8}\b/ },
  { name: 'rgb()/hsl() literal', pattern: /\b(?:rgba?|hsla?)\(\s*\d/ },
  {
    name: 'Tailwind arbitrary value (add a token or theme value instead)',
    pattern:
      /\b(?:bg|text|border|ring|fill|stroke|from|to|via|shadow|outline|divide|w|h|size|min-w|max-w|min-h|max-h|p|px|py|m|mx|my|gap|top|left|right|bottom|rounded|z|leading|tracking)-\[/,
  },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(jsx?|css)$/.test(entry) && !/\.test\.jsx?$/.test(entry)) yield full;
  }
}

let violations = 0;
for (const file of walk(SRC)) {
  if (ALLOWED_FILES.has(file)) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const { name, pattern } of RULES) {
        if (pattern.test(line)) {
          violations += 1;
          console.error(`${file}:${index + 1}  ${name}\n    ${line.trim()}`);
        }
      }
    });
}

if (violations > 0) {
  console.error(`\n${violations} hardcoded color/arbitrary value(s) found.`);
  process.exit(1);
}
console.log('No hardcoded colors or arbitrary values.');
