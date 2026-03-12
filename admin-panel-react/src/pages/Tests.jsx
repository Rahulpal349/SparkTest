import React, { useState, useEffect } from 'react';
import { Plus, Search, Book, Clock, ChevronRight, Info, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Tests.css';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [step, setStep] = useState(1);

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

        <div className="test-config-card card">
          <div className="config-header">
            <h2 className="section-title">Test Configuration</h2>
            <span className="step-indicator">Step {step} of 3</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <div className="info-banner">
            <Info size={18} />
            <span>Basic Information</span>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Test Title</label>
              <input type="text" className="form-input" placeholder="e.g. Mid-term Mathematics Exam - Fall 2024" />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select">
                <option>Select a category</option>
                <option>Electrical</option>
                <option>Electronics</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <div className="input-with-suffix">
                <input type="number" className="form-input" defaultValue="60" />
                <span className="input-suffix">min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="test-config-card card mt-6">
          <div className="config-header">
            <div className="flex items-center gap-2">
              <div className="icon-badge pink">
                <FileText size={18} />
              </div>
              <h3 className="section-title">Add Questions</h3>
            </div>
            <button className="text-btn">
              <ExternalLink size={16} />
              View Question Bank
            </button>
          </div>

          <div className="question-placeholder">
            <div className="placeholder-icon">
              <FileText size={48} />
            </div>
            <h3>No questions added yet</h3>
            <p>Start building your test by selecting questions from your bank or creating new ones.</p>
            <div className="placeholder-actions">
              <button className="btn btn-secondary">
                <Plus size={18} />
                From Question Bank
              </button>
              <button className="btn btn-primary">
                <Plus size={18} />
                Create New Question
              </button>
            </div>
          </div>
        </div>

        <div className="flow-footer">
          <button className="btn btn-secondary" onClick={() => setShowCreateFlow(false)}>Cancel</button>
          <button className="btn btn-primary">Save & Continue</button>
        </div>
      </div>
    );
  }

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
                  <span>{test.duration || 60} Minutes</span>
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
