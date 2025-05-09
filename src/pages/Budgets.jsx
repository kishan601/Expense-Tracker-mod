import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiEdit2, FiTrash2, FiPlusCircle, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

// Budget Edit Modal Component
const BudgetEditModal = ({ onClose, onSave, defaultValues = {} }) => {
  const [category, setCategory] = useState(defaultValues.category || 'Food');
  const [limit, setLimit] = useState(defaultValues.limit || '');
  const [period, setPeriod] = useState(defaultValues.period || 'monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    
    onSave({
      id: defaultValues.id || Date.now(),
      category,
      limit: parseFloat(limit),
      period
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{defaultValues.id ? 'Edit Budget' : 'Add New Budget'}</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                required
              >
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Budget Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0.00"
                className="form-control"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="form-control"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {defaultValues.id ? 'Update Budget' : 'Add Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Card border styles
const cardStyle = {
  position: 'relative',
  margin: '15px',
  zIndex: 1
};

const firstBorderStyle = {
  position: 'absolute',
  top: '-25px',
  left: '-25px',
  right: '-25px',
  bottom: '-25px',
  borderRadius: '16px',
  border: '1px solid rgba(124, 58, 237, 0.15)',
  zIndex: -1
};

const secondBorderStyle = {
  position: 'absolute',
  top: '-45px',
  left: '-45px',
  right: '-45px',
  bottom: '-45px',
  borderRadius: '16px',
  border: '1px solid rgba(124, 58, 237, 0.08)',
  zIndex: -2
};

export default function Budgets() {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');
  
  // State for budget data and modals
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('expense_tracker_budgets');
    if (savedBudgets) {
      return JSON.parse(savedBudgets);
    }
    
    // Default budgets if none in localStorage
    return [
      { id: 1, category: 'Food', limit: 500, period: 'monthly', currentSpending: 320 },
      { id: 2, category: 'Entertainment', limit: 200, period: 'monthly', currentSpending: 150 },
      { id: 3, category: 'Transportation', limit: 300, period: 'monthly', currentSpending: 280 },
      { id: 4, category: 'Housing', limit: 1200, period: 'monthly', currentSpending: 1200 },
      { id: 5, category: 'Utilities', limit: 150, period: 'monthly', currentSpending: 130 }
    ];
  });
  
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  
  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expense_tracker_budgets', JSON.stringify(budgets));
  }, [budgets]);
  
  // Function to handle adding new budget
  const handleAddBudget = (newBudget) => {
    // Add currentSpending of 0 to new budgets
    const budgetWithSpending = {
      ...newBudget,
      currentSpending: 0
    };
    
    setBudgets(prev => [...prev, budgetWithSpending]);
  };
  
  // Function to handle updating a budget
  const handleUpdateBudget = (updatedBudget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === updatedBudget.id 
        ? { ...budget, ...updatedBudget }
        : budget
    ));
  };
  
  // Function to handle deleting a budget
  const handleDeleteBudget = (id) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };
  
  // Calculate percentage of budget used
  const calculatePercentage = (spent, limit) => {
    return Math.min(Math.round((spent / limit) * 100), 100);
  };
  
  // Get color based on percentage used
  const getProgressColor = (percentage) => {
    if (percentage <= 50) return '#10b981'; // green
    if (percentage <= 75) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };
  
  // Total budget and spending
  const totalBudget = budgets.reduce((total, budget) => total + budget.limit, 0);
  const totalSpending = budgets.reduce((total, budget) => total + budget.currentSpending, 0);
  
  return (
    <div className="app-container">
      <div className="app-header-separator"></div>
      
      <div className="header-container">
        <Link to="/" className="btn btn-outline">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        
        <h1 className="header-title">Budget Management</h1>
        
        <div className="header-date">
          <FiCalendar />
          <span>{currentDate}</span>
        </div>
      </div>
      
     {/* Budget Overview Card - Enhanced with better visuals */}
<div className="card" style={cardStyle}>
  <div style={firstBorderStyle}></div>
  <div style={secondBorderStyle}></div>
  <div className="card-header">
    <h2 className="card-title">Budget Overview</h2>
  </div>
  <div className="card-body">
    {/* Top Stats with Icons */}
    <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      <div className="budget-stat-card">
        <div className="budget-stat-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="budget-stat-label">Total Budget</div>
          <div className="budget-stat-value">${totalBudget.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="budget-stat-card">
        <div className="budget-stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H9M15 4C15 3.46957 14.7893 2.96086 14.4142 2.58579C14.0391 2.21071 13.5304 2 13 2H11C10.4696 2 9.96086 2.21071 9.58579 2.58579C9.21071 2.96086 9 3.46957 9 4M15 4C15 4.53043 14.7893 5.03914 14.4142 5.41421C14.0391 5.78929 13.5304 6 13 6H11C10.4696 6 9.96086 5.78929 9.58579 5.41421C9.21071 5.03914 9 4.53043 9 4M12 11H16M12 16H16M8 11H8.01M8 16H8.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="budget-stat-label">Total Spending</div>
          <div className="budget-stat-value">${totalSpending.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="budget-stat-card">
        <div className="budget-stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C12 9.06087 11.5786 10.0783 10.8284 10.8284C10.0783 11.5786 9.06087 12 8 12C6.93913 12 5.92172 11.5786 5.17157 10.8284C4.42143 10.0783 4 9.06087 4 8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4C9.06087 4 10.0783 4.42143 10.8284 5.17157C11.5786 5.92172 12 6.93913 12 8V8Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8C20 9.06087 19.5786 10.0783 18.8284 10.8284C18.0783 11.5786 17.0609 12 16 12C14.9391 12 13.9217 11.5786 13.1716 10.8284C12.4214 10.0783 12 9.06087 12 8C12 6.93913 12.4214 5.92172 13.1716 5.17157C13.9217 4.42143 14.9391 4 16 4C17.0609 4 18.0783 4.42143 18.8284 5.17157C19.5786 5.92172 20 6.93913 20 8V8Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="budget-stat-label">Remaining</div>
          <div className="budget-stat-value">${(totalBudget - totalSpending).toLocaleString()}</div>
        </div>
      </div>
    </div>
    
    {/* Enhanced Progress Bar Section */}
    <div className="budget-progress-section">
      <div className="budget-progress-header">
        <h3>Overall Budget Usage</h3>
        <span className="budget-progress-percentage" style={{ 
          color: getProgressColor(calculatePercentage(totalSpending, totalBudget))
        }}>
          {calculatePercentage(totalSpending, totalBudget)}%
        </span>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${calculatePercentage(totalSpending, totalBudget)}%`,
            backgroundColor: getProgressColor(calculatePercentage(totalSpending, totalBudget))
          }}
        ></div>
      </div>
      
      <div className="budget-progress-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
          <span>Good (0-50%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Warning (51-75%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Critical (76-100%)</span>
        </div>
      </div>
    </div>
  </div>
</div>
      
      {/* Budget Categories Card */}
      <div className="card" style={{...cardStyle, marginTop: '45px'}}>
        <div style={firstBorderStyle}></div>
        <div style={secondBorderStyle}></div>
        <div className="card-header">
          <h2 className="card-title">Budget Categories</h2>
          <button className="btn-icon" onClick={() => setShowAddBudgetModal(true)}>
            <FiPlusCircle size={16} />
          </button>
        </div>
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Category</th>
                <th style={tableHeaderStyle}>Period</th>
                <th style={tableHeaderStyle}>Limit</th>
                <th style={tableHeaderStyle}>Spent</th>
                <th style={tableHeaderStyle}>Progress</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(budget => (
                <tr key={budget.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{budget.category}</td>
                  <td style={tableCellStyle}>{budget.period}</td>
                  <td style={tableCellStyle}>${budget.limit}</td>
                  <td style={tableCellStyle}>${budget.currentSpending}</td>
                  <td style={tableCellStyle}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px' }}>{calculatePercentage(budget.currentSpending, budget.limit)}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${calculatePercentage(budget.currentSpending, budget.limit)}%`,
                            backgroundColor: getProgressColor(calculatePercentage(budget.currentSpending, budget.limit)),
                            height: '6px'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => {
                          setCurrentBudget(budget);
                          setShowAddBudgetModal(true);
                        }}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowAddBudgetModal(true)}>
              <FiPlusCircle size={16} /> Add New Budget
            </button>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Budget Modal */}
      {showAddBudgetModal && (
        <BudgetEditModal
          onClose={() => {
            setShowAddBudgetModal(false);
            setCurrentBudget(null);
          }}
          onSave={(budgetData) => {
            if (currentBudget) {
              handleUpdateBudget(budgetData);
            } else {
              handleAddBudget(budgetData);
            }
          }}
          defaultValues={currentBudget || {}}
        />
      )}
    </div>
  );
}

// Additional styles
const tableHeaderStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  borderBottom: '1px solid #334155',
  color: '#94a3b8',
  fontSize: '14px'
};

const tableRowStyle = {
  borderBottom: '1px solid #1e293b'
};

const tableCellStyle = {
  padding: '12px 16px',
  fontSize: '14px'
};