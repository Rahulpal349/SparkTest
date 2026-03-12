import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronRight, Trash2, Edit2, X, Check, ArrowLeft, RefreshCcw, Plus, Image as ImageIcon, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { extractTextFromPDF, parseQuestions, parseQuestionsAlternative, extractSubject } from '../lib/pdfQuestionParser';
import './ImportQuestions.css';

const ImportQuestions = () => {
  const [step, setStep] = useState(1); // 1=Upload, 2=Review, 3=Done
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [category, setCategory] = useState('electrical');
  const [difficulty, setDifficulty] = useState('medium');
  const [inserting, setInserting] = useState(false);
  const [insertResult, setInsertResult] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase.from('tests').select('id, title').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching tests:', error);
        return;
      }
      setTests(data || []);
    } catch (err) {
      console.error('Fetch tests exception:', err);
    }
  };

  useEffect(() => {
    if (step === 2) {
      fetchTests();
    }
  }, [step]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setParseError('');
    } else {
      setParseError('Please upload a valid PDF file.');
    }
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setParseError('');

    try {
      const rawText = await extractTextFromPDF(file);
      
      // Try primary parser first
      let parsed = parseQuestions(rawText);
      
      // If primary parser finds few questions, try alternative
      if (parsed.length < 2) {
        const altParsed = parseQuestionsAlternative(rawText);
        if (altParsed.length > parsed.length) {
          parsed = altParsed;
        }
      }

      if (parsed.length === 0) {
        setParseError('Could not parse any questions from this PDF. The format may not be supported. Try a structured Q.1, Q.2... format.');
      } else {
        // Try to extract subject
        const detectedSubject = extractSubject(rawText);
        if (detectedSubject) {
          // If the detected subject contains "Reasoning", "Intelligence", etc., set appropriate category
          const lowerS = detectedSubject.toLowerCase();
          if (lowerS.includes('reasoning') || lowerS.includes('intelligence')) {
            setCategory('reasoning');
          } else if (lowerS.includes('electrical')) {
            setCategory('electrical');
          } else if (lowerS.includes('general awareness') || lowerS.includes('general study')) {
            setCategory('general');
          }
        }
        
        setQuestions(parsed);
        setStep(2);
      }
    } catch (err) {
      console.error('Parse error:', err);
      setParseError(`Failed to parse PDF: ${err.message}`);
    } finally {
      setParsing(false);
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditStart = (index) => {
    setEditingIndex(index);
    setEditForm({ ...questions[index] });
  };

  const handleEditSave = () => {
    setQuestions(prev => {
      const updated = prev.map((q, i) => i === editingIndex ? editForm : q);
      // Sort by question number
      return [...updated].sort((a, b) => (a.number || 0) - (b.number || 0));
    });
    setEditingIndex(null);
    setEditForm({});
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const handleImport = async () => {
    if (!selectedTestId) {
      alert('Please select a target test.');
      return;
    }

    setInserting(true);

    try {
      const rows = questions.map(q => ({
        test_id: selectedTestId,
        question_text: q.question_text,
        options: q.options,
        correct_option_id: q.correct_option_id,
        category: category,
        difficulty: difficulty,
        image_url: q.image_url || null,
      }));

      // Batch insert 50 rows at a time to avoid Supabase limits
      const BATCH_SIZE = 50;
      let totalInserted = 0;

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase.from('questions').insert(batch).select();
        if (error) throw error;
        totalInserted += data.length;
      }

      setInsertResult({ success: true, count: totalInserted });
      setStep(3);
    } catch (err) {
      console.error('Insert error:', err);
      setInsertResult({ success: false, error: err.message });
      setStep(3);
    } finally {
      setInserting(false);
    }
  };

  const handleAddManualQuestion = () => {
    const newQuestion = {
      number: questions.length + 1,
      question_text: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
        { id: 4, text: '' }
      ],
      correct_option_id: null,
      is_manual: true // Flag to distinguish manually added questions
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setEditingIndex(questions.length); // Immediately open edit mode for the new question
    setEditForm(newQuestion);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setInserting(true); // Reuse inserting state for upload feedback
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `question-figures/${fileName}`;

      const { data, error } = await supabase.storage
        .from('question-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('question-images')
        .getPublicUrl(filePath);

      setEditForm(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setInserting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFile(null);
    setQuestions([]);
    setParseError('');
    setInsertResult(null);
    setEditingIndex(null);
  };

  const questionsWithoutAnswer = questions.filter(q => q.correct_option_id === null).length;

  return (
    <div className="import-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Import Questions from PDF</h1>
          <p className="page-desc">Upload an Adda247-style PDF to bulk-import questions into a test.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="import-steps">
        <div className={`import-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? <Check size={16} /> : '1'}</div>
          <span>Upload PDF</span>
        </div>
        <div className="step-line"></div>
        <div className={`import-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? <Check size={16} /> : '2'}</div>
          <span>Review Questions</span>
        </div>
        <div className="step-line"></div>
        <div className={`import-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Complete</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="import-card card">
          <div
            className={`drop-zone ${file ? 'has-file' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileDrop}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="file-info">
                <FileText size={40} className="file-icon" />
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                <button className="change-file-btn" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  Change File
                </button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <Upload size={48} className="upload-icon" />
                <p className="drop-text">Drag & drop your PDF here</p>
                <p className="drop-subtext">or click to browse files</p>
              </div>
            )}
          </div>

          {parseError && (
            <div className="parse-error">
              <AlertCircle size={18} />
              <span>{parseError}</span>
            </div>
          )}

          <div className="import-settings">
            <div className="setting-group">
              <div className="setting-label-row">
                <label>Target Test</label>
                <button className="refresh-mini-btn" onClick={fetchTests} title="Refresh test list">
                  <RefreshCcw size={14} />
                </button>
              </div>
              <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
                <option value="">Select a test...</option>
                {tests.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              {tests.length === 0 && <p className="tiny-error">No tests found. Create one in the Tests page first.</p>}
            </div>
            <div className="setting-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="electrical">Electrical</option>
                <option value="electronics">Electronics</option>
                <option value="general">General Awareness</option>
                <option value="reasoning">Reasoning</option>
                <option value="quantitative">Quantitative Aptitude</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="import-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleParse}
              disabled={!file || parsing}
            >
              {parsing ? (
                <>
                  <span className="spinner"></span>
                  Parsing PDF...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Parse & Preview Questions
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="review-section">
          <div className="review-header card">
            <div className="review-stats">
              <div className="review-stat">
                <span className="stat-number">{questions.length}</span>
                <span className="stat-text">Questions Found</span>
              </div>
              <div className="review-stat">
                <span className="stat-number green">{questions.length - questionsWithoutAnswer}</span>
                <span className="stat-text">With Answer</span>
              </div>
              {questionsWithoutAnswer > 0 && (
                <div className="review-stat">
                  <span className="stat-number orange">{questionsWithoutAnswer}</span>
                  <span className="stat-text">No Answer Found</span>
                </div>
              )}
            </div>
            <div className="review-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-secondary" onClick={handleAddManualQuestion}>
                <Plus size={16} /> Add Question
              </button>
              <div className="review-select-wrapper">
                <select className="review-test-select" value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
                  <option value="">Select a test...</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <button className="refresh-mini-btn" onClick={fetchTests} title="Refresh test list">
                  <RefreshCcw size={14} />
                </button>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleImport} 
                disabled={inserting || !selectedTestId || questionsWithoutAnswer > 0}
              >
                {inserting ? (
                  <><span className="spinner"></span>Importing...</>
                ) : (
                  <>Import {questions.length} Questions</>
                )}
              </button>
            </div>
            {!selectedTestId && (
              <p className="warning-text">⚠️ {tests.length === 0 ? <>No tests found. Please <a href="/tests" style={{color: 'inherit', textDecoration: 'underline'}}>create a test</a> first.</> : 'Select a target test above before importing.'}</p>
            )}
            {questionsWithoutAnswer > 0 && selectedTestId && (
              <p className="warning-text" style={{color: '#DC2626'}}>🔴 {questionsWithoutAnswer} questions are missing answers. Please edit them before importing.</p>
            )}
          </div>

          <div className="questions-list">
            {questions.map((q, idx) => {
              const prevQ = idx > 0 ? questions[idx - 1] : null;
              const showSectionHeader = q.section && (!prevQ || prevQ.section !== q.section);
              
              return (
                <React.Fragment key={idx}>
                  {showSectionHeader && (
                    <div className="section-divider">
                      <span className="section-divider-text">{q.section}</span>
                    </div>
                  )}
                  <div className={`question-review-card card ${q.correct_option_id === null ? 'no-answer' : ''}`}>
                {editingIndex === idx ? (
                  /* Edit Mode */
                  <div className="edit-mode">
                    <div className="edit-header">
                      <span className="q-number">Q.{q.number || idx + 1}</span>
                      <div className="edit-actions">
                        <button className="icon-btn save" onClick={handleEditSave}><Check size={16} /></button>
                        <button className="icon-btn cancel" onClick={handleEditCancel}><X size={16} /></button>
                      </div>
                    </div>
                    <div className="edit-form-header">
                      <div className="edit-form-group">
                        <label className="edit-form-label">Q. No</label>
                        <input 
                          type="number" 
                          className="edit-q-number-input"
                          value={editForm.number || idx + 1}
                          onChange={(e) => setEditForm(prev => ({ ...prev, number: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="edit-form-group" style={{flex: 1}}>
                        <label className="edit-form-label">Question Text</label>
                        <textarea
                          className="edit-textarea"
                          value={editForm.question_text}
                          onChange={(e) => setEditForm(prev => ({ ...prev, question_text: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="edit-options-list">
                      {editForm.options?.map((opt, oi) => (
                        <div className="edit-option" key={opt.id}>
                          <div className="edit-option-main">
                            <input
                              type="radio"
                              name={`correct-${idx}`}
                              checked={editForm.correct_option_id === opt.id}
                              onChange={() => setEditForm(prev => ({ ...prev, correct_option_id: opt.id }))}
                            />
                            <input
                              type="text"
                              className="edit-option-input"
                              value={opt.text}
                              onChange={(e) => {
                                const newOpts = [...editForm.options];
                                newOpts[oi] = { ...newOpts[oi], text: e.target.value };
                                setEditForm(prev => ({ ...prev, options: newOpts }));
                              }}
                            />
                          </div>
                          <button 
                            className="icon-btn delete-mini" 
                            onClick={() => {
                              setEditForm(prev => ({
                                ...prev,
                                options: prev.options.filter(o => o.id !== opt.id),
                                correct_option_id: prev.correct_option_id === opt.id ? null : prev.correct_option_id
                              }));
                            }}
                            title="Remove Option"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button 
                        className="btn btn-secondary btn-sm add-option-btn" 
                        onClick={() => {
                          setEditForm(prev => {
                            const nextId = prev.options.length > 0 ? Math.max(...prev.options.map(o => o.id)) + 1 : 1;
                            return {
                              ...prev,
                              options: [...prev.options, { id: nextId, text: '' }]
                            };
                          });
                        }}
                      >
                        <Plus size={14} /> Add Option
                      </button>
                    </div>

                    <div className="edit-image-upload">
                      <label className="edit-form-label">Question Figure (Optional)</label>
                      <div className="image-upload-area">
                        {editForm.image_url ? (
                          <div className="image-preview-container">
                            <img src={editForm.image_url} alt="Figure preview" className="image-preview" />
                            <button className="remove-image-btn" onClick={() => setEditForm(prev => ({ ...prev, image_url: null }))}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="image-placeholder">
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                            <ImageIcon size={24} />
                            <span>Click to upload figure</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="q-header">
                      <span className="q-number">Q.{q.number || idx + 1}</span>
                      <div className="q-actions">
                        <button className="icon-btn edit" onClick={() => handleEditStart(idx)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDeleteQuestion(idx)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {q.image_url && (
                      <div className="q-image-container">
                        <img src={q.image_url} alt={`Q.${q.number || idx + 1} Figure`} className="q-review-image" />
                      </div>
                    )}
                    <p className="q-text">{q.question_text}</p>
                    <div className="q-options">
                      {q.options.map(opt => (
                        <div
                          key={opt.id}
                          className={`q-option ${q.correct_option_id === opt.id ? 'correct' : ''}`}
                        >
                          <span className="opt-marker">{opt.id}.</span>
                          <span className="opt-text">{opt.text}</span>
                          {q.correct_option_id === opt.id && <CheckCircle size={16} className="correct-icon" />}
                        </div>
                      ))}
                    </div>
                    {q.correct_option_id === null && (
                      <div className="no-answer-badge">
                        <AlertCircle size={14} />
                        No correct answer detected — please edit to set one
                      </div>
                    )}
                  </>
                )}
              </div>
            </React.Fragment>
          );
        })}
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div className="import-card card done-card">
          {insertResult?.success ? (
            <div className="done-content">
              <div className="done-icon success">
                <CheckCircle size={56} />
              </div>
              <h2>Import Successful!</h2>
              <p>{insertResult.count} questions imported into the selected test.</p>
              <div className="done-actions">
                <button className="btn btn-secondary" onClick={handleReset}>Import Another PDF</button>
                <a href="/questions" className="btn btn-primary">View Question Bank</a>
              </div>
            </div>
          ) : (
            <div className="done-content">
              <div className="done-icon error">
                <AlertCircle size={56} />
              </div>
              <h2>Import Failed</h2>
              <p>{insertResult?.error || 'An unknown error occurred.'}</p>
              <div className="done-actions">
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Go Back & Retry</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportQuestions;
