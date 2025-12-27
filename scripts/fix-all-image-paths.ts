/**
 * Fix All Image Paths
 * Updates all components to use Supabase Storage URLs instead of local paths
 */

import * as fs from 'fs';
import * as path from 'path';

const files = [
  {
    path: 'app/about/page.tsx',
    replacements: [
      {
        search: 'import Image from "next/image";',
        replace: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";'
      },
      {
        search: '"/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_01.jpg")'
      },
      {
        search: '"/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_02.jpg")'
      },
      {
        search: '"/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_03.jpg")'
      },
      {
        search: '"/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_04.jpg")'
      }
    ]
  },
  {
    path: 'app/features/page.tsx',
    replacements: [
      {
        search: 'import Image from "next/image";',
        replace: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";'
      },
      {
        search: '"/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_01.jpg")'
      },
      {
        search: '"/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_02.jpg")'
      },
      {
        search: '"/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_03.jpg")'
      },
      {
        search: '"/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg"',
        replace: 'getStorageUrl("couple-photos", "qoupl_couple_04.jpg")'
      }
    ]
  }
];

function fixFile(filePath: string, replacements: Array<{search: string, replace: string}>) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let changed = false;

  for (const { search, replace } of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

console.log('🔧 Fixing image paths...\n');

for (const file of files) {
  fixFile(file.path, file.replacements);
}

console.log('\n🎉 Done!');
