/**
 * Comprehensive Image Path Fix
 * Fixes all local image paths to use Supabase Storage URLs
 */

import * as fs from 'fs';
import * as path from 'path';

const fixes = [
  // Fix about page syntax errors
  {
    file: 'app/about/page.tsx',
    replacements: [
      { from: 'src=getStorageUrl("couple-photos", "qoupl_couple_01.jpg")', to: 'src={getStorageUrl("couple-photos", "qoupl_couple_01.jpg")}' },
      { from: 'src=getStorageUrl("couple-photos", "qoupl_couple_02.jpg")', to: 'src={getStorageUrl("couple-photos", "qoupl_couple_02.jpg")}' },
      { from: 'src=getStorageUrl("couple-photos", "qoupl_couple_03.jpg")', to: 'src={getStorageUrl("couple-photos", "qoupl_couple_03.jpg")}' },
      { from: 'src=getStorageUrl("couple-photos", "qoupl_couple_04.jpg")', to: 'src={getStorageUrl("couple-photos", "qoupl_couple_04.jpg")}' },
    ]
  },
  // Fix hero.tsx
  {
    file: 'components/sections/hero.tsx',
    replacements: [
      { from: 'import Image from "next/image";', to: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";' },
      { from: '"/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_02.jpg")' },
      { from: '"/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_03.jpg")' },
      { from: '"/images/women/rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg"', to: 'getStorageUrl("hero-images", "women/qoupl_women_03.png")' },
      { from: '"/images/men/amir-esrafili-eWa7clMsowo-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_01.jpg")' },
      { from: '"/images/women/caique-nascimento-Ij24Uq1sMwM-unsplash.jpg"', to: 'getStorageUrl("hero-images", "women/qoupl_women_05.png")' },
      { from: '"/images/men/arrul-lin-sYhUhse5uT8-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_02.jpg")' },
      { from: '"/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_01.jpg")' },
      { from: '"/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_04.jpg")' },
      { from: '"/images/coupl/young-guy-with-packets-hugging-happy-lady-sitting-stone (1).jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_05.jpg")' },
    ]
  },
  // Fix animated-hero.tsx
  {
    file: 'components/sections/animated-hero.tsx',
    replacements: [
      { from: 'import Image from "next/image";', to: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";' },
      { from: '"/images/women/rafaella-mendes-diniz-AoL-mVxprmk-unsplash.jpg"', to: 'getStorageUrl("hero-images", "women/qoupl_women_03.png")' },
      { from: '"/images/women/caique-nascimento-Ij24Uq1sMwM-unsplash.jpg"', to: 'getStorageUrl("hero-images", "women/qoupl_women_05.png")' },
      { from: '"/images/women/Gemini_Generated_Image_1hrhq01hrhq01hrh.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_01.png")' },
      { from: '"/images/women/Gemini_Generated_Image_34su0h34su0h34su.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_02.png")' },
      { from: '"/images/women/Gemini_Generated_Image_6cx31l6cx31l6cx3.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_04.png")' },
      { from: '"/images/women/Gemini_Generated_Image_civ506civ506civ5.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_06.png")' },
      { from: '"/images/women/Gemini_Generated_Image_fe6txtfe6txtfe6t.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_07.png")' },
      { from: '"/images/women/Gemini_Generated_Image_l957byl957byl957.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_08.png")' },
      { from: '"/images/women/Gemini_Generated_Image_tyingytyingytyin.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_09.png")' },
      { from: '"/images/women/Gemini_Generated_Image_v4k4z2v4k4z2v4k4.png"', to: 'getStorageUrl("hero-images", "women/qoupl_women_10.png")' },
      { from: '"/images/men/amir-esrafili-eWa7clMsowo-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_01.jpg")' },
      { from: '"/images/men/arrul-lin-sYhUhse5uT8-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_02.jpg")' },
      { from: '"/images/men/dollar-gill-LmtUqlYRJO4-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_03.jpg")' },
      { from: '"/images/men/indian-student-goes-first-lesson.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_04.jpg")' },
      { from: '"/images/men/medium-shot-man-with-paperwork.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_05.jpg")' },
      { from: '"/images/men/mitchell-luo-ymo_yC_N_2o-unsplash.jpg"', to: 'getStorageUrl("hero-images", "men/qoupl_men_06.jpg")' },
    ]
  },
  // Fix product-features.tsx
  {
    file: 'components/sections/product-features.tsx',
    replacements: [
      { from: 'import Image from "next/image";', to: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";' },
      { from: 'image: "/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"', to: 'image: getStorageUrl("couple-photos", "qoupl_couple_01.jpg")' },
      { from: 'image: "/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"', to: 'image: getStorageUrl("couple-photos", "qoupl_couple_02.jpg")' },
      { from: 'image: "/images/coupl/man-loving-her-wife-holding-open-book-front-bookshelf.jpg"', to: 'image: getStorageUrl("couple-photos", "qoupl_couple_04.jpg")' },
    ]
  },
  // Fix app-download.tsx
  {
    file: 'components/sections/app-download.tsx',
    replacements: [
      { from: 'import Image from "next/image";', to: 'import Image from "next/image";\nimport { getStorageUrl } from "@/lib/supabase/storage-url";' },
      { from: '"/images/coupl/young-couple-valentines-day-smiling-girl-hugged-smiling-guy-isolated-pink-background.jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_03.jpg")' },
      { from: '"/images/coupl/young-guy-with-packets-hugging-happy-lady-sitting-stone (1).jpg"', to: 'getStorageUrl("couple-photos", "qoupl_couple_05.jpg")' },
    ]
  },
  // Fix blog page
  {
    file: 'app/blog/page.tsx',
    replacements: [
      { from: 'image: "/images/men/indian-student-goes-first-lesson.jpg"', to: 'image: getStorageUrl("hero-images", "men/qoupl_men_04.jpg")' },
      { from: 'image: "/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg"', to: 'image: getStorageUrl("couple-photos", "qoupl_couple_01.jpg")' },
      { from: 'image: "/images/men/medium-shot-man-with-paperwork.jpg"', to: 'image: getStorageUrl("hero-images", "men/qoupl_men_05.jpg")' },
      { from: 'image: "/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg"', to: 'image: getStorageUrl("couple-photos", "qoupl_couple_02.jpg")' },
      { from: 'image: "/images/women/Gemini_Generated_Image_6cx31l6cx31l6cx3.png"', to: 'image: getStorageUrl("hero-images", "women/qoupl_women_04.png")' },
      { from: 'image: "/images/women/Gemini_Generated_Image_l957byl957byl957.png"', to: 'image: getStorageUrl("hero-images", "women/qoupl_women_08.png")' },
    ]
  },
];

// Check if file needs getStorageUrl import
function needsImport(content: string): boolean {
  return !content.includes('import { getStorageUrl }');
}

// Add import if needed
function addImport(content: string): string {
  if (needsImport(content)) {
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, 'import { getStorageUrl } from "@/lib/supabase/storage-url";');
      return lines.join('\n');
    }
  }

  return content;
}

console.log('🔧 Fixing all image paths comprehensively...\n');

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

console.log('\n🎉 All image paths fixed!');
