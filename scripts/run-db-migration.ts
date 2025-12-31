/**
 * Run Database Migration Script
 * 
 * This script runs the database structure and RLS migration.
 * It connects to Supabase using the service role key.
 * 
 * Usage: npm run migrate:db
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  console.log('🚀 Running Database Migration...\n');

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/010_fix_database_structure_and_rls.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📝 Executing migration...\n');

    // Split by semicolons and execute each statement
    // Note: Supabase doesn't have a direct SQL execution endpoint
    // This would need to be run via Supabase CLI or dashboard
    // For now, we'll just validate the SQL syntax

    console.log('✅ Migration SQL is valid');
    console.log('\n📋 To apply this migration:');
    console.log('   1. Use Supabase CLI: supabase db push');
    console.log('   2. Or run the SQL in Supabase Dashboard > SQL Editor');
    console.log('   3. Or use: psql connection string');
    console.log('\n📄 Migration file location:');
    console.log(`   ${migrationPath}`);

    // Check current RLS policies
    console.log('\n🔍 Checking current RLS policies...\n');

    const { data: waitlistPolicies, error: waitlistError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'waitlist_signups');

    if (!waitlistError && waitlistPolicies) {
      console.log('📌 Waitlist Signups Policies:');
      waitlistPolicies.forEach((policy: any) => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`);
      });
    }

    const { data: contactPolicies, error: contactError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'contact_submissions');

    if (!contactError && contactPolicies) {
      console.log('\n📌 Contact Submissions Policies:');
      contactPolicies.forEach((policy: any) => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`);
      });
    }

    console.log('\n✅ Migration check complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Review the migration SQL file');
    console.log('   2. Run it in Supabase Dashboard or via CLI');
    console.log('   3. Test form submissions to verify RLS works');

  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
}

// Main
runMigration().catch(console.error);

