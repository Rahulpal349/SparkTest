import React, { useState, useEffect } from 'react';
import { Plus, Search, Book, Clock, ChevronRight, Info, FileText, ExternalLink, X, Check, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Tests.css';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [step, setStep] = useState(1);

  // Test config state
  const [testTitle, setTestTitle] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testDuration, setTestDuration] = useState(60);
  const [testIdCustom, setTestIdCustom] = useState('');
  const [examType, setExamType] = useState('');
  const [testSubject, setTestSubject] = useState('');
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [hasNegativeMarking, setHasNegativeMarking] = useState(false);
  const [negativeMarkValue, setNegativeMarkValue] = useState(0.25);

  // Questions state
  const [addedQuestions, setAddedQuestions] = useState([]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBankIds, setSelectedBankIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  // New question form state
  const [newQ, setNewQ] = useState({
    question_text: '',
    option1: '', option2: '', option3: '', option4: '',
    correct_option: 1,
    difficulty: 'medium',
    category: 'electrical',
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankQuestions = async () => {
    setBankLoading(true);
    try {
      let query = supabase.from('questions').select('*').order('created_at', { ascending: false }).limit(100);
      if (bankSearch) {
        query = query.ilike('question_text', `%${bankSearch}%`);
      }
      const { data } = await query;
      // Filter out already-added questions
      const addedIds = new Set(addedQuestions.filter(q => q.id).map(q => q.id));
      setBankQuestions((data || []).filter(q => !addedIds.has(q.id)));
    } catch (err) {
      console.error('Error fetching bank:', err);
    } finally {
      setBankLoading(false);
    }
  };

  const openQuestionBank = () => {
    setShowQuestionBank(true);
    setSelectedBankIds(new Set());
    fetchBankQuestions();
  };

  const toggleBankSelection = (id) => {
    setSelectedBankIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addFromBank = () => {
    const selected = bankQuestions.filter(q => selectedBankIds.has(q.id));
    setAddedQuestions(prev => [...prev, ...selected]);
    setShowQuestionBank(false);
  };

  const addNewQuestion = () => {
    if (!newQ.question_text.trim()) return;
    const question = {
      _temp: true,
      _tempId: Date.now(),
      question_text: newQ.question_text,
      options: [
        { id: 1, text: newQ.option1 },
        { id: 2, text: newQ.option2 },
        { id: 3, text: newQ.option3 },
        { id: 4, text: newQ.option4 },
      ],
      correct_option_id: newQ.correct_option,
      difficulty: newQ.difficulty,
      category: newQ.category,
    };
    setAddedQuestions(prev => [...prev, question]);
    setNewQ({ question_text: '', option1: '', option2: '', option3: '', option4: '', correct_option: 1, difficulty: 'medium', category: 'electrical' });
    setShowNewQuestionForm(false);
  };

  const removeQuestion = (index) => {
    setAddedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTest = async () => {
    if (!testTitle.trim()) { alert('Please enter a test title.'); return; }
    if (addedQuestions.length === 0) { alert('Please add at least one question.'); return; }

    setSaving(true);
    try {
      // 1. Create the test
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .insert({
          title: testTitle,
          duration_minutes: testDuration,
          total_questions: addedQuestions.length,
          total_marks: addedQuestions.length * marksPerQuestion,
          test_id_custom: testIdCustom,
          exam_type: examType,
          subject: testSubject,
          marks_per_question: marksPerQuestion,
          has_negative_marking: hasNegativeMarking,
          negative_mark_value: hasNegativeMarking ? negativeMarkValue : 0,
        })
        .select()
        .single();

      if (testError) throw testError;

      // 2. Insert new questions (ones created inline) and link existing ones
      const questionsToInsert = [];
      const existingQuestionUpdates = [];

      for (const q of addedQuestions) {
        if (q._temp) {
          // New question — insert with test_id
          questionsToInsert.push({
            test_id: testData.id,
            question_text: q.question_text,
            options: q.options,
            correct_option_id: q.correct_option_id,
            difficulty: q.difficulty,
            category: q.category,
          });
        } else {
          // Existing question — update test_id
          existingQuestionUpdates.push(q.id);
        }
      }

      if (questionsToInsert.length > 0) {
        const { error } = await supabase.from('questions').insert(questionsToInsert);
        if (error) throw error;
      }

      if (existingQuestionUpdates.length > 0) {
        const { error } = await supabase
          .from('questions')
          .update({ test_id: testData.id })
          .in('id', existingQuestionUpdates);
        if (error) throw error;
      }

      alert(`Test "${testTitle}" created with ${addedQuestions.length} questions!`);
      setShowCreateFlow(false);
      setAddedQuestions([]);
      setTestTitle('');
      setTestCategory('');
      setTestDuration(60);
      setTestIdCustom('');
      setExamType('');
      setTestSubject('');
      setMarksPerQuestion(1);
      setHasNegativeMarking(false);
      setNegativeMarkValue(0.25);
      fetchTests();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save test: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== CREATE FLOW ====================
  if (showCreateFlow) {
    return (
      <div className="test-create-flow fade-in">
        <div className="breadcrumb">
          <span className="breadcrumb-path" onClick={() => setShowCreateFlow(false)}>Tests</span>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">New Test</span>
        </div>

        <div className="page-header">
          <h1 className="page-title">Create New Test</h1>
        </div>

        {/* Test Config */}
        <div className="test-config-card card">
          <div className="config-header">
            <h2 className="section-title">Test Configuration</h2>
          </div>
          <div className="info-banner">
            <Info size={18} />
            <span>Basic Information</span>
          </div>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Test ID (Internal)</label>
              <input type="text" className="form-input" placeholder="e.g. SSC-JE-24-01" value={testIdCustom} onChange={e => setTestIdCustom(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Test Name</label>
              <input type="text" className="form-input" placeholder="e.g. SSC JE Electrical Mock 1" value={testTitle} onChange={e => setTestTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Exam Type</label>
              <input type="text" className="form-input" placeholder="e.g. SSC JE / RRB JE" value={examType} onChange={e => setExamType(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" placeholder="e.g. Electrical Engineering" value={testSubject} onChange={e => setTestSubject(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <div className="input-with-suffix">
                <input type="number" className="form-input" value={testDuration} onChange={e => setTestDuration(parseInt(e.target.value) || 60)} />
                <span className="input-suffix">min</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Marks per Question</label>
              <input type="number" className="form-input" value={marksPerQuestion} onChange={e => setMarksPerQuestion(parseFloat(e.target.value) || 1)} step="0.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Negative Marking</label>
              <div className="toggle-group">
                <label className="toggle-switch">
                  <input type="checkbox" checked={hasNegativeMarking} onChange={e => setHasNegativeMarking(e.target.checked)} />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">{hasNegativeMarking ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {hasNegativeMarking && (
              <div className="form-group">
                <label className="form-label">Negative Marks Value</label>
                <input type="number" className="form-input" value={negativeMarkValue} onChange={e => setNegativeMarkValue(parseFloat(e.target.value) || 0)} step="0.05" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Total Marks (Auto)</label>
              <div className="marks-display">
                {(addedQuestions.length * marksPerQuestion).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Add Questions */}
        <div className="test-config-card card mt-6">
          <div className="config-header">
            <div className="flex items-center gap-2">
              <div className="icon-badge pink">
                <FileText size={18} />
              </div>
              <h3 className="section-title">Add Questions ({addedQuestions.length})</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={openQuestionBank}>
                <Plus size={16} /> From Bank
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowNewQuestionForm(true)}>
                <Plus size={16} /> New Question
              </button>
            </div>
          </div>

          {/* Inline New Question Form */}
          {showNewQuestionForm && (
            <div className="new-question-form">
              <div className="nq-header">
                <h4>Create New Question</h4>
                <button className="icon-close" onClick={() => setShowNewQuestionForm(false)}><X size={16} /></button>
              </div>
              <div className="nq-body">
                <div className="form-group full-width">
                  <label className="form-label">Question Text</label>
                  <textarea className="form-input form-textarea" rows={3} placeholder="Enter the question..." value={newQ.question_text} onChange={e => setNewQ(p => ({ ...p, question_text: e.target.value }))} />
                </div>
                <div className="nq-options-grid">
                  {[1, 2, 3, 4].map(n => (
                    <div className="nq-option-row" key={n}>
                      <input
                        type="radio" name="correct" checked={newQ.correct_option === n}
                        onChange={() => setNewQ(p => ({ ...p, correct_option: n }))}
                        style={{ accentColor: '#22C55E' }}
                      />
                      <input
                        type="text" className="form-input"
                        placeholder={`Option ${n}`}
                        value={newQ[`option${n}`]}
                        onChange={e => setNewQ(p => ({ ...p, [`option${n}`]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="nq-meta-row">
                  <select className="form-select" value={newQ.difficulty} onChange={e => setNewQ(p => ({ ...p, difficulty: e.target.value }))}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <select className="form-select" value={newQ.category} onChange={e => setNewQ(p => ({ ...p, category: e.target.value }))}>
                    <option value="electrical">Electrical</option>
                    <option value="electronics">Electronics</option>
                    <option value="general">General</option>
                  </select>
                  <button className="btn btn-primary btn-sm" onClick={addNewQuestion}>
                    <Check size={16} /> Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Added Questions List */}
          {addedQuestions.length > 0 ? (
            <div className="added-questions-list">
              {addedQuestions.map((q, i) => (
                <div className="added-q-item" key={q._tempId || q.id}>
                  <div className="aq-number">{i + 1}</div>
                  <div className="aq-content">
                    <p className="aq-text">{q.question_text}</p>
                    <div className="aq-meta">
                      <span className="aq-opts">{q.options?.length || 0} options</span>
                      <span className={`aq-diff ${q.difficulty || 'medium'}`}>{(q.difficulty || 'medium').charAt(0).toUpperCase() + (q.difficulty || 'medium').slice(1)}</span>
                      {q._temp && <span className="aq-new-badge">New</span>}
                    </div>
                  </div>
                  <button className="aq-remove" onClick={() => removeQuestion(i)} title="Remove"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="question-placeholder">
              <div className="placeholder-icon">
                <FileText size={48} />
              </div>
              <h3>No questions added yet</h3>
              <p>Start building your test by selecting questions from your bank or creating new ones.</p>
              <div className="placeholder-actions">
                <button className="btn btn-secondary" onClick={openQuestionBank}>
                  <Plus size={18} /> From Question Bank
                </button>
                <button className="btn btn-primary" onClick={() => setShowNewQuestionForm(true)}>
                  <Plus size={18} /> Create New Question
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flow-footer">
          <button className="btn btn-secondary" onClick={() => setShowCreateFlow(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveTest} disabled={saving}>
            {saving ? 'Saving...' : `Save Test (${addedQuestions.length} Q)`}
          </button>
        </div>

        {/* ===== Question Bank Modal ===== */}
        {showQuestionBank && (
          <div className="qbank-overlay" onClick={e => { if (e.target === e.currentTarget) setShowQuestionBank(false); }}>
            <div className="qbank-modal">
              <div className="qbank-header">
                <h2>Select from Question Bank</h2>
                <button className="icon-close" onClick={() => setShowQuestionBank(false)}><X size={20} /></button>
              </div>
              <div className="qbank-search">
                <Search size={18} className="qbank-search-icon" />
                <input
                  type="text" placeholder="Search questions..."
                  value={bankSearch}
                  onChange={e => { setBankSearch(e.target.value); }}
                  onKeyDown={e => { if (e.key === 'Enter') fetchBankQuestions(); }}
                />
                <button className="btn btn-sm btn-secondary" onClick={fetchBankQuestions}>Search</button>
              </div>
              <div className="qbank-list">
                {bankLoading ? (
                  <div className="qbank-loading">Loading questions...</div>
                ) : bankQuestions.length > 0 ? (
                  bankQuestions.map(q => (
                    <label className={`qbank-item ${selectedBankIds.has(q.id) ? 'selected' : ''}`} key={q.id}>
                      <input type="checkbox" checked={selectedBankIds.has(q.id)} onChange={() => toggleBankSelection(q.id)} />
                      <div className="qbank-item-content">
                        <p className="qbank-item-text">{q.question_text}</p>
                        <div className="qbank-item-meta">
                          <span>{q.options?.length || 0} options</span>
                          <span className={`aq-diff ${q.difficulty || 'medium'}`}>{q.difficulty || 'Unset'}</span>
                          <span>{q.category || 'General'}</span>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="qbank-empty">No questions found. Try a different search or import some via the Import page.</div>
                )}
              </div>
              <div className="qbank-footer">
                <span className="qbank-count">{selectedBankIds.size} selected</span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" onClick={() => setShowQuestionBank(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={addFromBank} disabled={selectedBankIds.size === 0}>
                    Add {selectedBankIds.size} Question{selectedBankIds.size !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== TEST LIST ====================
  return (
    <div className="tests-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tests Management</h1>
          <p className="page-desc">Create, edit, and organize your mock tests and exams.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateFlow(true)}>
          <Plus size={18} />
          <span>Create New Test</span>
        </button>
      </div>

      <div className="tests-grid">
        {loading ? (
          <div className="loading-state">Loading tests...</div>
        ) : tests.length > 0 ? (
          tests.map((test) => (
            <div key={test.id} className="test-card card">
              <div className="test-card-header">
                <div className="test-icon">
                  <Book size={20} />
                </div>
                <div className="test-meta">
                  <span className="test-category">{test.category || 'General'}</span>
                  <h3>{test.title}</h3>
                </div>
              </div>
              <div className="test-card-body">
                <div className="test-info-row">
                  <FileText size={16} />
                  <span>{test.total_questions || 0} Questions</span>
                </div>
                <div className="test-info-row">
                  <Clock size={16} />
                  <span>{test.duration_minutes || test.duration || 60} Minutes</span>
                </div>
              </div>
              <div className="test-card-footer">
                <button className="btn btn-secondary btn-sm">Edit</button>
                <button className="btn btn-primary btn-sm">Manage</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card card">
            <div className="placeholder-icon">
              <Book size={48} />
            </div>
            <h3>No tests found</h3>
            <p>You haven't created any tests yet. Click the button above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;
