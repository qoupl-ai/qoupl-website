/**
 * Database Structure Verification Script
 * 
 * Compares the actual Supabase database structure with migration files
 * Run: npm run verify:db (add to package.json)
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ColumnInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface IndexInfo {
  tablename: string;
  indexname: string;
  indexdef: string;
}

interface ConstraintInfo {
  table_name: string;
  constraint_name: string;
  constraint_type: string;
  column_name: string;
}

async function verifyDatabaseStructure() {
  console.log('🔍 Verifying Database Structure...\n');

  try {
    // 1. Check all tables exist
    console.log('📊 Checking tables...');
    const { data: tables, error: tablesError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });

    if (tablesError) {
      // Fallback: Use direct query
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (error) {
        console.error('❌ Error fetching tables:', error);
        return;
      }
      console.log('✅ Tables found:', data?.map(t => t.table_name).join(', '));
    }

    // 2. Check columns for key tables
    console.log('\n📋 Checking columns...');
    const keyTables = [
      'pages',
      'sections',
      'global_content',
      'blog_posts',
      'waitlist_signups',
      'contact_submissions',
    ];

    for (const table of keyTables) {
      const { data: columns, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table)
        .order('ordinal_position');

      if (error) {
        console.error(`❌ Error fetching columns for ${table}:`, error);
        continue;
      }

      if (columns && columns.length > 0) {
        console.log(`\n📌 ${table}:`);
        columns.forEach((col: any) => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
        });
      } else {
        console.log(`⚠️  ${table}: No columns found (table might not exist)`);
      }
    }

    // 3. Check for specific issues
    console.log('\n🔍 Checking for common issues...');

    // Check sections.component_type
    const { data: sectionsColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'sections')
      .in('column_name', ['component_type', 'section_type']);

    if (sectionsColumns && sectionsColumns.length > 0) {
      console.log('✅ sections table has:', sectionsColumns.map((c: any) => c.column_name).join(', '));
    } else {
      console.log('⚠️  sections table missing component_type or section_type');
    }

    // Check IP address types
    const { data: ipColumns } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .eq('table_schema', 'public')
      .eq('column_name', 'ip_address');

    if (ipColumns && ipColumns.length > 0) {
      ipColumns.forEach((col: any) => {
        if (col.data_type === 'text') {
          console.log(`⚠️  ${col.table_name}.ip_address is TEXT (should be INET)`);
        } else {
          console.log(`✅ ${col.table_name}.ip_address is ${col.data_type}`);
        }
      });
    }

    // Check for ENUMs vs TEXT
    const { data: statusColumns } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, udt_name')
      .eq('table_schema', 'public')
      .eq('column_name', 'status');

    if (statusColumns && statusColumns.length > 0) {
      statusColumns.forEach((col: any) => {
        if (col.data_type === 'text') {
          console.log(`⚠️  ${col.table_name}.status is TEXT (should be ENUM)`);
        } else {
          console.log(`✅ ${col.table_name}.status is ${col.udt_name || col.data_type}`);
        }
      });
    }

    // 4. Check indexes
    console.log('\n📇 Checking indexes...');
    const { data: indexes, error: indexesError } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname')
      .eq('schemaname', 'public')
      .in('tablename', keyTables);

    if (!indexesError && indexes) {
      const indexesByTable = indexes.reduce((acc: any, idx: any) => {
        if (!acc[idx.tablename]) acc[idx.tablename] = [];
        acc[idx.tablename].push(idx.indexname);
        return acc;
      }, {});

      Object.entries(indexesByTable).forEach(([table, idxs]: [string, any]) => {
        console.log(`   ${table}: ${idxs.length} indexes`);
      });
    }

    // 5. Check constraints
    console.log('\n🔒 Checking constraints...');
    const { data: constraints, error: constraintsError } = await supabase
      .from('information_schema.table_constraints')
      .select('table_name, constraint_name, constraint_type')
      .eq('table_schema', 'public')
      .in('table_name', keyTables);

    if (!constraintsError && constraints) {
      const constraintsByTable = constraints.reduce((acc: any, c: any) => {
        if (!acc[c.table_name]) acc[c.table_name] = [];
        acc[c.table_name].push(`${c.constraint_type}: ${c.constraint_name}`);
        return acc;
      }, {});

      Object.entries(constraintsByTable).forEach(([table, cons]: [string, any]) => {
        console.log(`   ${table}: ${cons.length} constraints`);
      });
    }

    console.log('\n✅ Verification complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the output above');
    console.log('   2. Compare with migration files');
    console.log('   3. Create migration for any missing columns/constraints');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

// Alternative: Use raw SQL query
async function verifyWithSQL() {
  console.log('🔍 Verifying with SQL queries...\n');

  // Note: Supabase client doesn't support arbitrary SQL
  // You'll need to run these in Supabase SQL Editor or use a direct PostgreSQL client

  const queries = [
    {
      name: 'All Tables',
      sql: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    },
    {
      name: 'Sections Columns',
      sql: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'sections'
        ORDER BY ordinal_position;
      `
    },
    {
      name: 'IP Address Types',
      sql: `
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'ip_address';
      `
    }
  ];

  console.log('📋 Run these queries in Supabase SQL Editor:\n');
  queries.forEach((q, i) => {
    console.log(`${i + 1}. ${q.name}:`);
    console.log(q.sql);
    console.log('');
  });
}

// Main
async function main() {
  const useSQL = process.argv.includes('--sql');
  
  if (useSQL) {
    await verifyWithSQL();
  } else {
    await verifyDatabaseStructure();
  }
}

main().catch(console.error);

