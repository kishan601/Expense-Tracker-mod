import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiSun, FiMoon } from 'react-icons/fi';
import './DashboardHeader.css';

export default function DashboardHeader({ 
  title, 
  date, 
  onAddExpense, 
  onAddIncome,
  darkMode,
  setDarkMode
}) {
  return (
    <header className="dashboard-header">
      <div className="header-title-area">
        <h1>{title}</h1>
      </div>
      
      <div className="header-date">
        <FiCalendar size={14} />
        <span>{date}</span>
      </div>
      
      <div className="header-actions">
        <nav className="main-nav">
          <Link to="/reports">Reports</Link>
          <Link to="/budgets">Budgets</Link>
          <Link to="/bills">Bills</Link>
        </nav>
        
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        
        <button className="btn btn-primary" onClick={onAddExpense}>
          + Add Expense
        </button>
        
        <button className="btn btn-outline" onClick={onAddIncome}>
          + Add Income
        </button>
      </div>
    </header>
  );
}