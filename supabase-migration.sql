-- ============================================
-- SparkTest Question Redesigner - Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. PDF Uploads Table
CREATE TABLE IF NOT EXISTS pdf_uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT,
    extracted_text TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_questions INTEGER DEFAULT 0,
    processed_questions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Original Questions Table
CREATE TABLE IF NOT EXISTS original_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pdf_id UUID REFERENCES pdf_uploads(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Redesigned Questions Table
CREATE TABLE IF NOT EXISTS redesigned_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_question_id UUID REFERENCES original_questions(id) ON DELETE CASCADE,
    redesigned_text TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    learning_objectives TEXT,
    suggested_answers TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS Policies
ALTER TABLE pdf_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE original_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redesigned_questions ENABLE ROW LEVEL SECURITY;

-- pdf_uploads: users can only access their own uploads
CREATE POLICY "Users can insert own uploads" ON pdf_uploads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own uploads" ON pdf_uploads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own uploads" ON pdf_uploads
    FOR UPDATE USING (auth.uid() = user_id);

-- original_questions: users can access questions from their own PDFs
CREATE POLICY "Users can insert questions for own PDFs" ON original_questions
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM pdf_uploads WHERE id = pdf_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can view questions for own PDFs" ON original_questions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM pdf_uploads WHERE id = pdf_id AND user_id = auth.uid())
    );

-- redesigned_questions: users can access redesigned versions of their own questions
CREATE POLICY "Users can insert redesigned questions" ON redesigned_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM original_questions oq
            JOIN pdf_uploads pu ON oq.pdf_id = pu.id
            WHERE oq.id = original_question_id AND pu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view redesigned questions" ON redesigned_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM original_questions oq
            JOIN pdf_uploads pu ON oq.pdf_id = pu.id
            WHERE oq.id = original_question_id AND pu.user_id = auth.uid()
        )
    );

-- 5. Storage Bucket (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('question-pdfs', 'question-pdfs', false);
