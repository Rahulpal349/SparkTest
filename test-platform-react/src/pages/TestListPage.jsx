import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export default function TestListPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [tests, setTests] = useState([]);
  const [categoryName, setCategoryName] = useState('Tests');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('technical');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch category name
      if (categoryId) {
        const { data: catData } = await supabase
          .from('test_categories')
          .select('name')
          .eq('id', categoryId)
          .single();
        if (catData) setCategoryName(catData.name);
      }

      // Fetch tests
      let query = supabase.from('tests').select('*');
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tests:', error);
      } else {
        setTests(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    document.title = `${categoryName} - SparkTest`;
    if (!loading) {
      gsap.from(".test-row-card", { opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }
  }, [categoryName, loading]);

  return (
    <div className="mock-tests-page">
      <UserHeader />

      {/* Tab Navigation */}
      <div className="test-tabs-container">
        <div className="test-tabs">
          <button 
            className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Subject Test (Technical)<span className="tab-count">({tests.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sectional' ? 'active' : ''}`}
            onClick={() => setActiveTab('sectional')}
          >
            Sectional Test<span className="tab-count">(0)</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'full' ? 'active' : ''}`}
            onClick={() => setActiveTab('full')}
          >
            Full Test<span className="tab-count">(0)</span>
          </button>
        </div>
      </div>

      {/* Test List */}
      <div className="test-list-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#6B7280' }}>Loading tests...</p>
          </div>
        ) : tests.length > 0 ? (
          tests.map((test) => (
            <div className="test-row-card" key={test.id}>
              <div className="card-main">
                {test.is_free && <span className="status-badge free">FREE</span>}
                <div className="card-content-side">
                  <h3 className="test-title">{test.title}</h3>
                  <div className="test-meta">
                    <div className="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      <span>{test.total_questions} Questions</span>
                    </div>
                    <div className="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      <span>{test.total_marks} Marks</span>
                    </div>
                    <div className="meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>{test.duration_minutes} Mins</span>
                    </div>
                  </div>
                </div>
                <div className="card-action-side">
                  <Link to={`/instructions?test=${test.id}`} className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', textDecoration: 'none' }}>Start Now</Link>
                </div>
              </div>
              <div className="card-strip">
                <div className="strip-links">
                  <a href="#" className="strip-link">Syllabus</a>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#f0f0f0', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#4B5563' }}>
                    {test.languages?.join(', ') || 'English'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
            <p>No tests available in this category yet.</p>
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
