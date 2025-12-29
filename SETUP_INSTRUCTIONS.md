# 🚀 Quick Setup Instructions

Follow these steps in order to set up your Supabase-powered qoupl website.

## ✅ What's Already Done

- ✅ All images renamed with proper naming convention
  - Women: `qoupl_women_01.png` → `qoupl_women_10.jpg`
  - Men: `qoupl_men_01.jpg` → `qoupl_men_06.jpg`
  - Couples: `qoupl_couple_01.jpg` → `qoupl_couple_05.jpg`
  - Screenshots: `qoupl_screenshot_01.png` → `qoupl_screenshot_07.png`
  - Logos: `qoupl_logo.svg`, `qoupl_apple_icon.svg`

- ✅ Supabase packages upgraded to latest
- ✅ Database schema designed
- ✅ TypeScript types generated
- ✅ Automation scripts created

## 📝 Step-by-Step Setup

### Step 1: Add Supabase Credentials

1. Open the file: [.env.local](.env.local)
2. Go to your Supabase project: https://app.supabase.com
3. Click on your project
4. Go to **Settings** → **API**
5. Copy and paste the following:

```bash
# From "Project URL"
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# From "Project API keys" → anon/public
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# From "Project API keys" → service_role (⚠️ KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

6. Save the file

### Step 2: Create Database Tables

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open: [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql)
6. Copy ALL the contents (Cmd/Ctrl + A, then Cmd/Ctrl + C)
7. Paste into the Supabase SQL Editor
8. Click **Run** button (or press Cmd/Ctrl + Enter)
9. Wait for "Success" message (~5-10 seconds)

**Option B: Using Supabase CLI**

```bash
# Install CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace YOUR_PROJECT_REF)
supabase link --project-ref YOUR_PROJECT_REF

# Push migration
supabase db push
```

**Verify Tables Created:**
- Go to **Table Editor** in Supabase Dashboard
- You should see 15 tables including: `pages`, `blog_posts`, `faqs`, `features`, etc.
- `pages` table should have 12 rows (pre-seeded)

### Step 3: Create Storage Buckets

Run this command in your terminal:

```bash
npm run setup:storage
```

**Expected output:**
```
📦 Creating bucket: hero-images
   ✅ Created bucket "hero-images" (public)

📦 Creating bucket: couple-photos
   ✅ Created bucket "couple-photos" (public)

📦 Creating bucket: app-screenshots
   ✅ Created bucket "app-screenshots" (public)

📦 Creating bucket: blog-images
   ✅ Created bucket "blog-images" (public)

📦 Creating bucket: user-uploads
   ✅ Created bucket "user-uploads" (private)

✨ Storage setup complete!
```

**Verify Buckets:**
- Go to **Storage** in Supabase Dashboard
- You should see 5 buckets created

### Step 4: Upload Images to Supabase Storage

Run this command:

```bash
npm run upload:images
```

**This will upload:**
- 10 women profile images → `hero-images` bucket
- 6 men profile images → `hero-images` bucket
- 5 couple photos → `couple-photos` bucket
- 7 app screenshots → `app-screenshots` bucket

**Total: 28 images**

**Expected output:**
```
📤 Starting image upload to Supabase Storage...
📋 Total images to upload: 28

📤 Uploading: women/qoupl_women_01.png (6093.77 KB)
   ✅ Uploaded successfully
...

📊 Upload Summary:
   ✅ Uploaded: 28
   ⏭️  Skipped (already exist): 0
   ❌ Failed: 0
   📦 Total: 28

✨ Images uploaded successfully!
```

### Step 5: Seed Content Data

Run this command:

```bash
npm run seed:content
```

**This will create:**
- 32 FAQ items (across 8 categories)
- 6 blog posts (with full content)
- 16 features (across 4 categories)
- 5 pricing plans

**Expected output:**
```
🌱 Starting content seeding...

📝 Seeding FAQs...
✅ Seeded 32 FAQs

📰 Seeding blog posts...
✅ Seeded 6 blog posts

✨ Seeding features...
✅ Seeded 16 features

💰 Seeding pricing plans...
✅ Seeded 5 pricing plans

✨ Content seeding complete!
```

### Step 6: Create Your Admin User

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User** → **Create new user**
3. Enter your email and password
4. Check **Auto Confirm User**
5. Click **Create user**
6. **Copy the User UID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 7: Add Admin Permission

1. Go to **Table Editor** → **admin_users**
2. Click **Insert** → **Insert row**
3. Fill in:
   - **user_id**: Paste the User UID from Step 6
   - **email**: Your admin email
   - **name**: Your name
   - **is_active**: `true` (check the box)
4. Click **Save**

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] `.env.local` has all 3 Supabase credentials
- [ ] 15 tables exist in Supabase (Table Editor)
- [ ] `pages` table has 12 rows
- [ ] `faq_categories` table has 8 rows
- [ ] `blog_categories` table has 5 rows
- [ ] `global_content` table has 3 rows
- [ ] 5 storage buckets created (Storage)
- [ ] 28 images uploaded to storage
- [ ] `media` table has 28 rows
- [ ] `faqs` table has 32 rows
- [ ] `blog_posts` table has 6 rows
- [ ] `features` table has 16 rows
- [ ] `pricing_plans` table has 5 rows
- [ ] Admin user created (Authentication → Users)
- [ ] Admin permission added (`admin_users` table has 1 row)

## 🧪 Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000
   - Site should load without errors
   - Check browser console for any Supabase errors

3. Try the CMS login (will be built next):
   - Visit: http://localhost:3000/add-content
   - Should redirect to login page
   - Login with your admin credentials

## 🚨 Troubleshooting

### "Missing environment variables" error
- Double-check `.env.local` has all 3 keys
- Restart dev server after adding credentials: `npm run dev`

### Tables not created
- Re-run the SQL migration in Supabase Dashboard
- Check for any SQL errors in the query results

### Buckets already exist
- That's fine! The script will update existing buckets
- You can re-run `npm run setup:storage` safely

### Images failed to upload
- Check bucket names match exactly
- Verify buckets are set to "public"
- Ensure service role key is correct

### "Invalid API key" error
- Verify you copied the correct keys from Supabase
- Check for extra spaces in `.env.local`
- Make sure you're using the anon key (not service role) for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📚 Next Steps

Once setup is complete, we'll build:

1. ✅ **Login Page** (`/login`) with Supabase Auth UI
2. ✅ **CMS Dashboard** (`/add-content`) for content management
3. ✅ **CRUD Operations** for all content types
4. ✅ **Publish History** tracking
5. ✅ **Refactor Pages** to use Supabase data instead of hardcoded content

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Check [supabase/README.md](supabase/README.md) for detailed documentation
- Review [CONTENT_AUDIT.md](CONTENT_AUDIT.md) for content structure

---

**Setup Status:** Ready for you to add credentials and run the setup!
**Estimated Time:** 10-15 minutes
