/**
 * Fix JSX Syntax Errors
 * Adds {} braces around getStorageUrl function calls in JSX
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Find all files with the syntax error
const result = execSync(
  'grep -rn "src=getStorageUrl" components/ app/ 2>/dev/null || echo ""',
  { encoding: 'utf-8', cwd: path.join(__dirname, '..') }
);

const filesToFix = new Set<string>();

result.split('\n').forEach(line => {
  if (line.trim()) {
    const match = line.match(/^([^:]+):/);
    if (match) {
      filesToFix.add(match[1]);
    }
  }
});

console.log('🔧 Fixing JSX syntax errors...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix src=getStorageUrl(...) to src={getStorageUrl(...)}
  content = content.replace(/src=getStorageUrl\(/g, 'src={getStorageUrl(');

  // Now we need to find the matching closing parenthesis and add }
  // This regex finds getStorageUrl calls and captures the content
  content = content.replace(
    /src=\{getStorageUrl\(([^)]+)\)(?!\})/g,
    'src={getStorageUrl($1)}'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n🎉 All JSX syntax errors fixed!');
