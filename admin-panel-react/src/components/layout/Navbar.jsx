import React from 'react';
import { Search, Bell, Settings, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="main-header">
      <div className="search-bar">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search for tests, students, or questions..." />
      </div>

      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        
        <button className="icon-btn">
          <Settings size={20} />
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Rahul Pal</span>
            <span className="user-role">Super Admin</span>
          </div>
          <div className="avatar-wrapper">
            <img 
              src="https://ui-avatars.com/api/?name=Rahul+Pal&background=FF8C00&color=fff&bold=true" 
              alt="Admin Avatar" 
              className="avatar" 
            />
            <div className="status-indicator"></div>
          </div>
          <ChevronDown size={16} className="text-muted" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
