import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const clearFilters = () => {
    setDifficultyFilter('');
    setCategoryFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="questions-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Question Bank</h1>
          <p className="page-desc">Manage and organize your assessment questions and quiz library.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          <span>Add Question</span>
        </button>
      </div>

      <div className="card">
        <div className="table-controls">
          <div className="search-box">
            <Search size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search questions by content, ID, or tags..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <Filter size={16} className="text-muted" />
              <select 
                className="filter-select"
                value={difficultyFilter}
                onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select 
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Category</option>
                <option value="electrical">Electrical</option>
                <option value="electronics">Electronics</option>
                <option value="general">General Awareness</option>
              </select>
            </div>

            {(difficultyFilter || categoryFilter || searchTerm) && (
              <div className="active-filters">
                {difficultyFilter && (
                  <span className="filter-tag">
                    {difficultyFilter.toUpperCase()}
                    <X size={12} onClick={() => setDifficultyFilter('')} />
                  </span>
                )}
                {categoryFilter && (
                  <span className="filter-tag">
                    {categoryFilter.toUpperCase()}
                    <X size={12} onClick={() => setCategoryFilter('')} />
                  </span>
                )}
                <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="questions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>QUESTION CONTENT</th>
                <th>CATEGORY</th>
                <th>DIFFICULTY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((q) => (
                  <tr key={q.id}>
                    <td className="id-cell">Q-{q.id.toString().slice(-4)}</td>
                    <td className="content-cell">
                      <div className="question-text-truncate">
                        {q.question_text}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {q.category?.toUpperCase() || 'GENERAL'}
                      </span>
                    </td>
                    <td>
                      <span className={`difficulty-indicator ${q.difficulty || 'easy'}`}>
                        <span className="dot"></span>
                        {q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) : 'Easy'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-action-btn edit" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-action-btn delete" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    {loading ? 'Loading questions...' : 'No questions found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <span className="showing-text">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} questions
          </span>
          <div className="pagination">
            <button 
              className="chevron-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            
            <button 
              className="chevron-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
