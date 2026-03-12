-- ============================================
-- SparkTest Mock Test Platform - Database Migration
-- ============================================

-- 1. Test Categories
CREATE TABLE IF NOT EXISTS test_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_type TEXT, -- 'chapter', 'subject', 'full', 'mini', 'special'
    total_tests_available INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tests Table
CREATE TABLE IF NOT EXISTS tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES test_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT false,
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- [{"id": "a", "text": "..."}, ...]
    correct_option_id TEXT NOT NULL,
    explanation TEXT,
    subject_tag TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Test Submissions / Results
CREATE TABLE IF NOT EXISTS test_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_possible_score INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    answers JSONB, -- {"question_id": "selected_option_id", ...}
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS
ALTER TABLE test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
CREATE POLICY "Public categories are viewable by all" ON test_categories FOR SELECT USING (true);
CREATE POLICY "Public tests are viewable by allauthenticated users" ON tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Questions are viewable by authenticated users" ON questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own submissions" ON test_submissions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON test_submissions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 7. Initial Data
INSERT INTO test_categories (name, description, icon_type, total_tests_available) VALUES
('Chapter Test (Electrical)', 'Specific tests covering individual chapters.', 'chapter', 50),
('Subject Test (CBT 1 + CBT 2)', 'Full subjects like Network Theory, Machines, etc.', 'subject', 20),
('Full Test (CBT 1 + CBT 2)', 'Complete mock exams matching actual patterns.', 'full', 10),
('Mini Full Test (CBT 2)', 'Shorter versions of full tests.', 'mini', 15),
('Exam Day Special', 'Curated for the final stretch.', 'special', 5);

-- Seed Tests (Wait until IDs are known, or use a script. Here we use placeholders)
-- For demonstration, let's assume we fetch the category ID first.
-- In a real scenario, you'd get these IDs from the DB.

-- Example: Add a test to categories
DO $$
DECLARE
    cat_id UUID;
    test_id UUID;
BEGIN
    SELECT id INTO cat_id FROM test_categories WHERE icon_type = 'subject' LIMIT 1;
    
    INSERT INTO tests (category_id, title, total_questions, total_marks, duration_minutes, is_free)
    VALUES (cat_id, 'SAIL MT EE Network Theory Mock Test', 5, 10, 10, true)
    RETURNING id INTO test_id;

    -- Add Questions for this test
    INSERT INTO questions (test_id, question_text, options, correct_option_id, explanation, subject_tag, difficulty)
    VALUES 
    (test_id, 'A 10V DC source is connected across a series combination of a 5-ohm resistor and a 2-Henry inductor. What is the current through the circuit at t = 0.5 seconds?', 
    '[{"id": "a", "text": "1.43 Amperes"}, {"id": "b", "text": "1.26 Amperes"}, {"id": "c", "text": "0.86 Amperes"}, {"id": "d", "text": "2.00 Amperes"}]', 'b', 'Using i(t) = (V/R)(1 - e^(-Rt/L))...', 'Network Theory', 'hard'),
    
    (test_id, 'The unit of magnetic flux density is:', 
    '[{"id": "a", "text": "Weber"}, {"id": "b", "text": "Tesla"}, {"id": "c", "text": "Henry"}, {"id": "d", "text": "Farad"}]', 'b', 'Tesla is the SI unit of magnetic flux density.', 'Electrical Machines', 'easy'),
    
    (test_id, 'Kirchhoffs current law is based on the law of conservation of:', 
    '[{"id": "a", "text": "Energy"}, {"id": "b", "text": "Momentum"}, {"id": "c", "text": "Mass"}, {"id": "d", "text": "Charge"}]', 'd', 'KCL is based on the conservation of charge.', 'Network Theory', 'easy'),
    
    (test_id, 'Superposition theorem is applicable to:', 
    '[{"id": "a", "text": "Linear circuits only"}, {"id": "b", "text": "Non-linear circuits only"}, {"id": "c", "text": "Both linear and non-linear"}, {"id": "d", "text": "None of these"}]', 'a', 'Superposition applies only to linear bilateral networks.', 'Network Theory', 'medium'),
    
    (test_id, 'An ideal voltage source has:', 
    '[{"id": "a", "text": "Zero internal resistance"}, {"id": "b", "text": "Infinite internal resistance"}, {"id": "c", "text": "Moderate internal resistance"}, {"id": "d", "text": "None of these"}]', 'a', 'Ideal voltage sources have zero internal resistance to maintain constant voltage.', 'Network Theory', 'medium');
END $$;
