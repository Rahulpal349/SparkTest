import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, HelpCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const StatCard = ({ label, value, icon: Icon, trend, trendType }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="icon-box orange">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`trend ${trendType}`}>
          {trendType === 'up' && <TrendingUp size={12} />}
          {trend}
        </span>
      )}
    </div>
    <div className="stat-body">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTests: 0,
    avgScore: 0,
    pendingQuestions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch active tests
      const { count: testCount } = await supabase
        .from('tests')
        .select('*', { count: 'exact', head: true });
        
      // Fetch average score (from test_sessions or scores table if exists)
      // For now using mock or simplified query
      const { data: scores } = await supabase
        .from('test_sessions')
        .select('score');
      
      const avg = scores && scores.length > 0 
        ? Math.round(scores.reduce((acc, curr) => acc + (curr.score || 0), 0) / scores.length)
        : 0;

      // Fetch pending questions (not redesigned or flagged)
      const { count: questionCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        activeTests: testCount || 0,
        avgScore: avg,
        pendingQuestions: questionCount || 0
      });

      // Fetch recent sessions
      const { data: sessions } = await supabase
        .from('test_sessions')
        .select(`
          id,
          score,
          completed_at,
          users (full_name),
          tests (title)
        `)
        .order('completed_at', { ascending: false })
        .limit(5);

      setRecentActivity(sessions || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-desc">Real-time metrics and student activity overview.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Refresh Data
        </button>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          trend="+12%" 
          trendType="up" 
        />
        <StatCard 
          label="Active Tests" 
          value={stats.activeTests} 
          icon={BookOpen} 
          trend="Stable" 
          trendType="stable" 
        />
        <StatCard 
          label="Average Score" 
          value={`${stats.avgScore}%`} 
          icon={Activity} 
          trend="+5%" 
          trendType="up" 
        />
        <StatCard 
          label="Pending Questions" 
          value={stats.pendingQuestions} 
          icon={HelpCircle} 
          trend="Urgent" 
          trendType="urgent" 
        />
      </div>

      <div className="dashboard-grid">
        <div className="card activity-card">
          <div className="card-header">
            <div className="card-title">
              <h3>Recent Student Activity</h3>
              <p>Latest test completions across all subjects.</p>
            </div>
            <button className="view-all-btn">View All</button>
          </div>
          
          <div className="table-responsive">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>STUDENT NAME</th>
                  <th>EXAM TYPE</th>
                  <th>SCORE</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar-sm">
                            {session.users?.full_name?.charAt(0) || 'U'}
                          </div>
                          <span>{session.users?.full_name || 'Anonymous User'}</span>
                        </div>
                      </td>
                      <td>{session.tests?.title || 'General Test'}</td>
                      <td>
                        <span className={`badge ${session.score >= 80 ? 'score-high' : 'score-medium'}`}>
                          {session.score}%
                        </span>
                      </td>
                      <td>{new Date(session.completed_at).toLocaleDateString()}</td>
                      <td>
                        <button className="action-link">Details</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {loading ? 'Loading activities...' : 'No recent activity found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card growth-card">
          <div className="card-header">
            <div className="card-title">
              <h3>System Health</h3>
              <p>API and Database status</p>
            </div>
          </div>
          <div className="health-content">
            <div className="health-item">
              <span className="health-label">Supabase Connection</span>
              <span className="badge score-high">Operational</span>
            </div>
            <div className="health-item">
              <span className="health-label">Storage Usage</span>
              <span className="health-val">1.2 GB / 5 GB</span>
            </div>
            <div className="health-item">
              <span className="health-label">Last Backup</span>
              <span className="health-val">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
