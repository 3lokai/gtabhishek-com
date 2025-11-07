# Row Level Security (RLS) Setup for Contact Messages

## Quick Setup

Run the SQL in `prisma/migrations/setup_rls.sql` in your Supabase SQL Editor:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and paste the contents of `prisma/migrations/setup_rls.sql`
5. Click **Run**

## What This Does

1. **Enables RLS** on the `contact_messages` table
2. **Allows public inserts** - Anyone can submit the contact form (no auth required)
3. **Restricts reads** - Only authenticated users can read messages (you can modify this later)

## Policies Explained

### Public Insert Policy
```sql
CREATE POLICY "Allow public insert on contact_messages"
ON contact_messages FOR INSERT TO public WITH CHECK (true);
```
- Allows anonymous users to insert contact messages
- Required for the contact form to work without authentication

### Authenticated Read Policy
```sql
CREATE POLICY "Allow authenticated read on contact_messages"
ON contact_messages FOR SELECT TO authenticated USING (true);
```
- Only authenticated users can read contact messages
- You can modify this later if you want to restrict access further

## Customization

If you want to:
- **Allow only service role to read**: Remove the authenticated read policy and use the service role policy (commented out in the SQL)
- **Restrict inserts by IP or rate limiting**: Modify the insert policy with additional checks
- **Add update/delete policies**: Add policies for UPDATE and DELETE operations

## Testing

After setting up RLS:
1. Test the contact form - it should work without authentication
2. Try reading messages via Supabase client - should require authentication
3. Verify in Supabase Dashboard → Authentication → Policies that the policies are active

