import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  HelpCircle, 
  BarChart2, 
  Layers,
  LogOut,
  Plus
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'users', label: 'Users', icon: Users, path: '/users' },
    { id: 'tests', label: 'Tests', icon: BookOpen, path: '/tests' },
    { id: 'questions', label: 'Questions', icon: HelpCircle, path: '/questions' },
    { id: 'redesigner', label: 'Redesigner', icon: Layers, path: '/redesigner' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2, path: '/analytics' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text text-black">Spark</span>
          <span className="logo-text text-primary">Test</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-primary create-btn">
          <Plus size={18} />
          <span>Create New</span>
        </button>
        
        <div className="logout-container">
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
