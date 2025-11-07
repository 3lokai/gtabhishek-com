# Contact Form Setup Guide

## Database Connection (Supabase)

To get your `DATABASE_URL` for Prisma:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Select **URI** tab
6. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. Add it to your `.env.local` file:

```env
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Database (from Supabase Dashboard → Settings → Database → Connection string → URI)
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"

# Contact Form
RESEND_API_KEY="your-resend-api-key"
CONTACT_EMAIL="your-email@example.com"
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..." # Optional
```

## Setup Steps

1. **Get DATABASE_URL from Supabase** (see above)

2. **Run Prisma migrations**:
   ```bash
   npx prisma migrate dev --name init_contact_messages
   npx prisma generate
   ```

3. **Update email "from" address** in `src/app/contact/actions.ts`:
   - Replace `onboarding@resend.dev` with your verified Resend domain
   - Lines 144 and 168

4. **Test the form** - Submit a test message to verify everything works!

## Database Schema

The contact form creates a `contact_messages` table with:
- `id` (UUID, primary key)
- `name` (VARCHAR 100)
- `email` (VARCHAR 255)
- `message` (TEXT)
- `created_at` (TIMESTAMP)

## Features

✅ Saves to database via Prisma  
✅ Sends 2 Resend emails (to you + confirmation to user)  
✅ Sends Slack webhook notification (if configured)  
✅ Honeypot spam protection (hidden "website" field)

