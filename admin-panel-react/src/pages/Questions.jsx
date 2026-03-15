import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Filter, Image as ImageIcon, RotateCcw, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, searchTerm, difficultyFilter, categoryFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.ilike('question_text', `%${searchTerm}%`);
      }
      if (difficultyFilter) {
        query = query.eq('difficulty', difficultyFilter);
      }
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;
      setQuestions(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetBank = async () => {
    setResetting(true);
    try {
      // Direct delete without filter to clear everything
      const { error } = await supabase
        .from('questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy filter for bypass

      if (error) throw error;
      
      setQuestions([]);
      setTotalCount(0);
      setShowResetConfirm(false);
      alert('Question bank has been reset successfully.');
    } catch (err) {
      console.error('Reset error:', err);
      alert('Failed to reset bank: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const clearFilters = () => {
    setDifficultyFilter('');
    setCategoryFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="questions-page fade-in">
      <div className="page-header-premium">
        <div className="header-info">
          <h1 className="page-title-premium">Question Bank</h1>
          <p className="page-desc-premium">Manage your central repository of {totalCount} assessment items.</p>
        </div>
        <div className="header-actions">
          <button className="btn-reset-premium" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw size={16} />
            <span>Reset Bank</span>
          </button>
          <button className="btn-add-premium">
            <Plus size={18} />
            <span>New Question</span>
          </button>
        </div>
      </div>

      <div className="glass-card main-content">
        <div className="table-controls-premium">
          <div className="search-bar-premium">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by question text or tags..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="filters-row-premium">
            <div className="filter-select-group">
              <div className="select-wrapper">
                <Filter size={14} className="select-icon" />
                <select 
                  value={difficultyFilter}
                  onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="select-wrapper">
                <select 
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Categories</option>
                  <option value="electrical">Electrical</option>
                  <option value="electronics">Electronics</option>
                  <option value="general">General Awareness</option>
                  <option value="reasoning">Reasoning</option>
                </select>
              </div>
            </div>

            {(difficultyFilter || categoryFilter || searchTerm) && (
              <button className="btn-clear-pill" onClick={clearFilters}>
                Clear Filters
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="questions-list-premium">
          {loading ? (
            <div className="loading-state-premium">
               <div className="spinner-premium"></div>
               <p>Fetching questions...</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="table-wrapper-premium">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>QUESTION</th>
                    <th>TOPIC</th>
                    <th>DIFFICULTY</th>
                    <th className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id}>
                      <td className="id-col">
                         <span className="id-tag">Q-{q.id.toString().slice(0, 4)}</span>
                      </td>
                      <td className="question-col">
                        <div className="question-content-premium">
                          {q.image_url && <ImageIcon size={14} className="img-indicator" title="Has figure" />}
                          <span className="q-text-premium">{q.question_text}</span>
                        </div>
                      </td>
                      <td className="topic-col">
                        <span className="topic-tag">{q.category?.toUpperCase() || 'ELECTRICAL'}</span>
                      </td>
                      <td className="diff-col">
                        <span className={`diff-pill ${q.difficulty || 'easy'}`}>
                          {q.difficulty?.toUpperCase() || 'EASY'}
                        </span>
                      </td>
                      <td className="actions-col">
                        <div className="btn-group-premium">
                          <button className="btn-action-premium edit" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button className="btn-action-premium delete" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-premium">
              <div className="empty-icon-wrapper">
                <Search size={40} />
              </div>
              <h3>No questions found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>

        {/* Improved Pagination */}
        <div className="pagination-footer-premium">
          <div className="pagination-info">
            Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span>-<span>{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <strong>{totalCount}</strong>
          </div>
          <div className="pagination-btns-premium">
            <button 
              className="btn-nav-premium"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="page-numbers-premium">
               {currentPage > 3 && <span className="ellipsis-premium">...</span>}
               {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i + 1}
                    className={`num-btn-premium ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
               {currentPage < totalPages - 2 && <span className="ellipsis-premium">...</span>}
            </div>
            <button 
              className="btn-nav-premium"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay-premium">
          <div className="modal-card-premium destructive scale-in">
            <div className="modal-header-danger">
              <AlertTriangle size={24} />
              <h2>Reset Question Bank?</h2>
            </div>
            <div className="modal-body-premium">
              <p>This action will <strong>permanently delete all questions</strong> from the repository. This cannot be undone.</p>
              <p className="sub-text">Are you absolutely sure you want to proceed?</p>
            </div>
            <div className="modal-footer-premium">
              <button 
                className="btn-modal-secondary" 
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button 
                className="btn-modal-danger" 
                onClick={handleResetBank}
                disabled={resetting}
              >
                {resetting ? <span className="spinner-mini"></span> : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
