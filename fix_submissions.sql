-- Add finished_at column to test_submissions if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'test_submissions' AND column_name = 'finished_at') THEN
        ALTER TABLE test_submissions ADD COLUMN finished_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add UPDATE policy for test_submissions
DROP POLICY IF EXISTS "Users can update own submissions" ON test_submissions;
CREATE POLICY "Users can update own submissions" ON test_submissions
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
