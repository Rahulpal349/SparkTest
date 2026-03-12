import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle, 
  Download, 
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Analytics.css';

const SummaryCard = ({ label, value, trend, trendValue, progress }) => (
  <div className="summary-card">
    <div className="summary-header">
      <span className="summary-label">{label}</span>
      <div className={`summary-trend ${trend === 'up' ? 'up' : 'down'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trendValue}
      </div>
    </div>
    <div className="summary-value">{value}</div>
    {progress !== undefined && (
      <div className="activity-bar-container">
        <div className="activity-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgScore: 0,
    completionRate: 0,
    totalStudents: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setStats({
        avgScore: 84.6,
        completionRate: 92.3,
        totalStudents: 1240
      });
      setLoading(false);
    }, 800);
  };

  const topTests = [
    { name: "Intro to Advanced Physics", participants: 428, completion: 98, score: 88, trend: "+4.2%" },
    { name: "Classical Mechanics Q3", participants: 312, completion: 85, score: 72, trend: "-1.5%" },
    { name: "Data Structures & Algos", participants: 589, completion: 94, score: 81, trend: "+12.8%" },
    { name: "Modern World History", participants: 245, completion: 99, score: 92, trend: "Stable" }
  ];

  return (
    <div className="analytics-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics Overview</h1>
          <p className="page-desc">Real-time insights into student performance and engagement.</p>
        </div>
        <div className="header-actions">
          <div className="date-picker">
            <Calendar size={18} />
            <select className="filter-select-minimal">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="analytics-summary">
        <SummaryCard 
          label="AVG. SCORE" 
          value={`${stats.avgScore}%`} 
          trend="up" 
          trendValue="+5.2%" 
          progress={stats.avgScore}
        />
        <SummaryCard 
          label="COMPLETION RATE" 
          value={`${stats.completionRate}%`} 
          trend="up" 
          trendValue="+1.8%" 
          progress={stats.completionRate}
        />
        <SummaryCard 
          label="TOTAL STUDENTS" 
          value={stats.totalStudents.toLocaleString()} 
          trend="up" 
          trendValue="+12.0%" 
        />
      </div>

      <div className="analytics-grid">
        <div className="card trend-card">
          <div className="card-header">
            <h3 className="section-title">Score Trends</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot primary"></span> Average</span>
              <span className="legend-item"><span className="dot muted"></span> Benchmark</span>
            </div>
          </div>
          <div className="mock-chart-container">
            {[45, 65, 85, 70, 95].map((val, i) => (
              <div key={i} className="chart-bar-wrap">
                <div className="bar-track">
                  <motion.div 
                    className="bar-fill"
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="bar-label">Week {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card activity-stats-card">
          <div className="card-header">
            <h3 className="section-title">Daily Activity</h3>
            <span className="subtitle">Last 7 Days</span>
          </div>
          <div className="activity-rows">
            {[
              { day: 'Mon', val: 65, count: 214 },
              { day: 'Tue', val: 85, count: 452 },
              { day: 'Wed', val: 75, count: 312 },
              { day: 'Thu', val: 95, count: 589 },
              { day: 'Fri', val: 45, count: 120 }
            ].map((d, i) => (
              <div key={i} className="activity-row">
                <span className="day-name">{d.day}</span>
                <div className="row-bar-track">
                  <motion.div 
                    className="row-bar-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${d.val}%` }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                  />
                </div>
                <span className="row-val">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header items-center">
          <h3 className="section-title">Top Performing Tests</h3>
          <div className="search-box-minimal">
            <Search size={18} />
            <input type="text" placeholder="Search tests..." />
          </div>
        </div>

        <div className="table-responsive">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>TEST NAME</th>
                <th>PARTICIPANTS</th>
                <th>COMPLETION</th>
                <th>AVG. SCORE</th>
                <th>TREND</th>
              </tr>
            </thead>
            <tbody>
              {topTests.map((test, i) => (
                <tr key={i}>
                  <td className="font-bold">{test.name}</td>
                  <td>{test.participants}</td>
                  <td>
                    <div className="table-progress">
                      <div className="mini-bar-track">
                        <div className="mini-bar-fill" style={{ width: `${test.completion}%` }}></div>
                      </div>
                      <span className="pct-val">{test.completion}%</span>
                    </div>
                  </td>
                  <td className="font-semibold">{test.score}%</td>
                  <td>
                    <span className={`trend-pill ${test.trend.startsWith('+') ? 'up' : test.trend === 'Stable' ? 'stable' : 'down'}`}>
                      {test.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
