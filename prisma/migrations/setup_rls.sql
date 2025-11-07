-- Enable Row Level Security on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to insert (for Prisma server-side operations)
CREATE POLICY "Allow service role insert on contact_messages"
ON contact_messages
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Allow service role to read (for admin operations)
CREATE POLICY "Allow service role read on contact_messages"
ON contact_messages
FOR SELECT
TO service_role
USING (true);

-- Policy: Allow public to insert (if using Supabase client directly)
-- Note: This is optional if you only use Prisma server-side
CREATE POLICY "Allow public insert on contact_messages"
ON contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only authenticated users can read contact messages
-- (You can modify this later if you want to restrict reads further)
CREATE POLICY "Allow authenticated read on contact_messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

