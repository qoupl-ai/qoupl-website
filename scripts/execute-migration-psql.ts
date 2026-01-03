/**
 * Execute Database Migration using psql
 * 
 * This script executes the migration SQL using psql (PostgreSQL client).
 * It reads the connection string from environment variables.
 * 
 * Usage: npm run migrate:db:psql
 * 
 * Requirements:
 * - psql must be installed
 * - Database connection string in .env.local
 */

import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract database connection details from Supabase URL
function getConnectionString(): string | null {
  if (!supabaseUrl) return null;
  
  // Supabase URL format: https://[project-ref].supabase.co
  // Database connection: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  
  // We need the database password - it's usually in the connection string
  // For Supabase, you can get it from Dashboard → Settings → Database → Connection string
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!dbPassword) {
    console.log('ℹ️  Database password not found in SUPABASE_DB_PASSWORD');
    console.log('📋 To get the connection string:');
    console.log('   1. Go to Supabase Dashboard → Settings → Database');
    console.log('   2. Copy the "Connection string" (URI format)');
    console.log('   3. Add it to .env.local as SUPABASE_DB_CONNECTION_STRING\n');
    return null;
  }
  
  return `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
}

async function executeMigration() {
  console.log('🚀 Executing Database Migration via psql...\n');

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/010_fix_database_structure_and_rls.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📝 SQL length:', migrationSQL.length, 'characters\n');

    // Try to get connection string
    const connectionString = process.env.SUPABASE_DB_CONNECTION_STRING || getConnectionString();
    
    if (!connectionString) {
      console.log('⚠️  Cannot execute migration automatically.');
      console.log('📋 Please use one of these methods:\n');
      
      console.log('✅ Method 1: Supabase Dashboard (Easiest)');
      console.log('   1. Go to: https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Go to SQL Editor → New Query');
      console.log('   4. Copy the entire migration file:');
      console.log(`      ${migrationPath}`);
      console.log('   5. Paste and click "Run"\n');
      
      console.log('✅ Method 2: psql (If you have connection string)');
      console.log('   1. Get connection string from Supabase Dashboard → Settings → Database');
      console.log('   2. Add to .env.local: SUPABASE_DB_CONNECTION_STRING="your-connection-string"');
      console.log('   3. Run: npm run migrate:db:psql\n');
      
      return;
    }

    // Check if psql is available
    try {
      execSync('which psql', { stdio: 'ignore' });
    } catch {
      console.log('❌ psql is not installed or not in PATH');
      console.log('📋 Install PostgreSQL client or use Supabase Dashboard method\n');
      return;
    }

    console.log('⏳ Executing migration via psql...\n');
    
    // Write SQL to temp file
    const tempFile = join(process.cwd(), '.migration_temp.sql');
    writeFileSync(tempFile, migrationSQL);

    try {
      // Execute via psql
      const command = `psql "${connectionString}" -f "${tempFile}"`;
      const output = execSync(command, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      console.log('✅ Migration executed successfully!\n');
      console.log(output);
      
      // Clean up temp file
      unlinkSync(tempFile);
      
      console.log('\n✅ Migration completed!');
      console.log('💡 Next steps:');
      console.log('   1. Test form submissions to verify RLS works');
      console.log('   2. Verify admins can read submissions');
      
    } catch (error: any) {
      console.error('❌ Error executing migration:', error.message);
      if (error.stdout) console.log('Output:', error.stdout);
      if (error.stderr) console.error('Error:', error.stderr);
      
      // Clean up temp file
      try {
        unlinkSync(tempFile);
      } catch {}
      
      console.log('\n📋 Alternative: Use Supabase Dashboard method (see above)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

executeMigration().catch(console.error);

