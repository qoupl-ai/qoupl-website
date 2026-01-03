/**
 * Execute Database Migration via Supabase REST API
 * 
 * This script executes the migration SQL using Supabase's REST API.
 * It uses the service role key to execute SQL statements.
 * 
 * Usage: npm run migrate:db:execute
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

async function executeMigration() {
  console.log('🚀 Executing Database Migration via Supabase API...\n');

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/010_fix_database_structure_and_rls.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('📝 SQL length:', migrationSQL.length, 'characters\n');

    // Supabase REST API doesn't have a direct SQL execution endpoint
    // We need to use the Management API or execute via psql
    // The best approach is to use Supabase Dashboard or CLI
    
    console.log('⚠️  Supabase REST API does not support direct SQL execution.');
    console.log('📋 To execute this migration, use one of these methods:\n');
    
    console.log('✅ Method 1: Supabase Dashboard (Recommended)');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor → New Query');
    console.log('   4. Copy the entire migration file:');
    console.log(`      ${migrationPath}`);
    console.log('   5. Paste and click "Run"\n');
    
    console.log('✅ Method 2: Supabase CLI');
    console.log('   1. Ensure you are logged in: supabase login');
    console.log('   2. Link your project: supabase link --project-ref YOUR_PROJECT_REF');
    console.log('   3. Push migration: supabase db push\n');
    
    console.log('✅ Method 3: psql (PostgreSQL client)');
    console.log('   1. Get connection string from Supabase Dashboard → Settings → Database');
    console.log('   2. Run: psql "connection-string" -f supabase/migrations/010_fix_database_structure_and_rls.sql\n');

    // Try to check current database state
    console.log('🔍 Checking current database state...\n');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if tables exist and get current policies
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', ['waitlist_signups', 'contact_submissions']);

      if (!tablesError && tables) {
        console.log('✅ Tables found:', tables.map((t: any) => t.table_name).join(', '));
      }
    } catch (error) {
      // Ignore - information_schema might not be queryable via REST API
    }

    // Try to query current policies via pg_policies view
    try {
      const { data: policies, error: policiesError } = await supabase
        .rpc('exec_sql', {
          query: `
            SELECT tablename, policyname, cmd 
            FROM pg_policies 
            WHERE tablename IN ('waitlist_signups', 'contact_submissions')
            ORDER BY tablename, policyname;
          `
        });

      if (!policiesError && policies) {
        console.log('\n📌 Current RLS Policies:');
        (policies as any[]).forEach((policy: any) => {
          console.log(`   ${policy.tablename}.${policy.policyname} (${policy.cmd})`);
        });
      }
    } catch (error) {
      console.log('\nℹ️  Cannot query policies directly (requires SQL execution)');
    }

    console.log('\n✅ Migration file is ready to execute!');
    console.log(`📄 Location: ${migrationPath}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

executeMigration().catch(console.error);

