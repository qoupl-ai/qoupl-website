# Security Architecture

## Defense-in-Depth Authorization

This document outlines the security architecture for the qoupl website CMS.

## Single Source of Truth: `assertAdmin()`

**Location:** `lib/auth/assert-admin.ts`

All admin authorization checks MUST use `assertAdmin()`. This function:
1. Verifies user is authenticated
2. Checks `admin_users` table for active admin status
3. Redirects to `/login` if not authenticated
4. Throws error if not admin

### Usage

```typescript
import { assertAdmin } from '@/lib/auth/assert-admin'

// In server actions
export async function myAction() {
  await assertAdmin() // Single authorization check
  // ... proceed with admin operation
}

// In page components
export default async function AdminPage() {
  const { user, adminUser } = await assertAdmin()
  // ... render admin UI
}
```

## Row Level Security (RLS) Policies

**Location:** `supabase/migrations/002_fix_rls_policies.sql`

RLS policies use the `is_admin()` function which:
- Checks `admin_users` table
- Verifies `user_id = auth.uid()`
- Verifies `is_active = true`

**This exactly matches `assertAdmin()` logic**, providing defense-in-depth.

### Policy Pattern

```sql
CREATE POLICY "Admins full access [table]" ON [table]
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
```

## Admin Client Usage

**Location:** `lib/supabase/admin.ts`

The `adminClient` uses the service role key and **bypasses RLS**.

### ✅ Approved: Scripts Only

- Migration scripts (`scripts/*.ts`)
- Setup scripts (`scripts/*.ts`)
- One-time data operations

### ❌ Forbidden: User-Facing Code

- Server actions
- API routes
- Page components

**For user-facing operations:**
1. Use `assertAdmin()` for authorization
2. Use `createClient()` from `@/lib/supabase/server`
3. Let RLS policies enforce access

## CMS Route Protection

All routes under `/add-content/*` are protected by:
1. **Layout-level protection:** `app/add-content/layout.tsx` calls `assertAdmin()`
2. **Page-level protection:** Individual pages also call `assertAdmin()` for redundancy
3. **RLS policies:** Database enforces admin access at the data layer

## Security Layers

1. **Application Layer:** `assertAdmin()` in all server actions and pages
2. **Database Layer:** RLS policies using `is_admin()` function
3. **Network Layer:** Service role key only in scripts (never exposed to clients)

## Verification

To verify security:

```bash
# Check all assertAdmin() usage
grep -r "assertAdmin" app/

# Check for adminClient in non-script files
grep -r "adminClient" app/ --exclude-dir=scripts

# Verify RLS policies match
grep -r "is_admin()" supabase/migrations/
```

## Best Practices

1. ✅ Always use `assertAdmin()` before admin operations
2. ✅ Use regular client after `assertAdmin()` (RLS enforces)
3. ✅ Use `adminClient` only in scripts
4. ✅ Never expose service role key to client
5. ✅ Keep RLS policies aligned with `assertAdmin()` logic

