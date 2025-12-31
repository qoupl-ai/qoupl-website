/**
 * Execute Database Migration Directly
 * 
 * This script executes the migration SQL using Supabase Management API.
 * It uses the service role key to execute SQL via HTTP request.
 * 
 * Usage: npm run migrate:db:direct
 */

import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

async function executeMigration() {
  console.log('🚀 Executing Database Migration...\n');

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/010_fix_database_structure_and_rls.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('📝 SQL length:', migrationSQL.length, 'characters\n');

    // Extract project ref from URL
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
      process.exit(1);
    }
    
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
    const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

    console.log('⏳ Executing migration via Supabase Management API...\n');

    // Execute SQL via Management API
    const response = await fetch(managementApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Migration failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      // If Management API doesn't work, provide alternatives
      if (response.status === 404 || response.status === 403) {
        console.log('\n⚠️  Management API endpoint not available or unauthorized.');
        console.log('📋 Please use Supabase Dashboard method:\n');
        console.log('   1. Go to: https://supabase.com/dashboard');
        console.log('   2. Select your project');
        console.log('   3. Go to SQL Editor → New Query');
        console.log('   4. Copy the entire migration file:');
        console.log(`      ${migrationPath}`);
        console.log('   5. Paste and click "Run"\n');
      }
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Migration executed successfully!\n');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    console.log('\n✅ Migration completed!');
    console.log('💡 Next steps:');
    console.log('   1. Test form submissions to verify RLS works');
    console.log('   2. Verify admins can read submissions');

  } catch (error: any) {
    console.error('❌ Error executing migration:', error.message);
    
    console.log('\n📋 Alternative: Use Supabase Dashboard');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project → SQL Editor → New Query');
    console.log('   3. Copy migration file and paste');
    console.log('   4. Click "Run"\n');
    
    process.exit(1);
  }
}

executeMigration().catch(console.error);

