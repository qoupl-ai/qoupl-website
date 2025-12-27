/**
 * Fix Remaining Screenshot References
 * Updates /qoupl/ paths to use Supabase Storage app-screenshots bucket
 */

import * as fs from 'fs';
import * as path from 'path';

const fixes = [
  {
    file: 'components/sections/coming-soon.tsx',
    replacements: [
      { from: 'import Image from "next/image";', to: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";' },
      { from: '"/qoupl/1.png"', to: 'getStorageUrl("app-screenshots", "qoupl_screenshot_01.png")' },
      { from: '"/qoupl/2.png"', to: 'getStorageUrl("app-screenshots", "qoupl_screenshot_02.png")' },
      { from: '"/qoupl/3.png"', to: 'getStorageUrl("app-screenshots", "qoupl_screenshot_03.png")' },
      { from: '"/qoupl/4.png"', to: 'getStorageUrl("app-screenshots", "qoupl_screenshot_04.png")' },
      { from: '"/qoupl/5.png"', to: 'getStorageUrl("app-screenshots", "qoupl_screenshot_05.png")' },
    ]
  },
  {
    file: 'app/features/page.tsx',
    replacements: [
      { from: 'image: "/qoupl/1.png"', to: 'image: getStorageUrl("app-screenshots", "qoupl_screenshot_01.png")' },
      { from: 'image: "/qoupl/3.png"', to: 'image: getStorageUrl("app-screenshots", "qoupl_screenshot_03.png")' },
      { from: 'image: "/qoupl/4.png"', to: 'image: getStorageUrl("app-screenshots", "qoupl_screenshot_04.png")' },
      { from: 'image: "/qoupl/6.png"', to: 'image: getStorageUrl("app-screenshots", "qoupl_screenshot_06.png")' },
    ]
  },
];

console.log('🔧 Fixing remaining screenshot references...\n');

for (const fix of fixes) {
  const filePath = path.join(__dirname, '..', fix.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fix.file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  for (const replacement of fix.replacements) {
    if (content.includes(replacement.from)) {
      content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${fix.file}`);
  } else {
    console.log(`⏭️  No changes needed: ${fix.file}`);
  }
}

console.log('\n🎉 All screenshot references fixed!');
