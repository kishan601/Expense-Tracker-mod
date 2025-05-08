import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiEdit2, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { loadDataFromLocalStorage, calculateCategoryTotals } from '../lib/storage';

export default function Budgets() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food', amount: 2000, color: '#ac5ddf' },
    { id: 2, category: 'Entertainment', amount: 1000, color: '#ffc32b' },
    { id: 3, category: 'Travel', amount: 3000, color: '#4bd268' },
    { id: 4, category: 'Utilities', amount: 1500, color: '#ff5c81' },
    { id: 5, category: 'Electronics', amount: 500, color: '#3ee0cf' }
  ]);

  const data = loadDataFromLocalStorage() || { expenses: [] };
  const expenses = data.expenses || [];
  const categoryTotals = calculateCategoryTotals(expenses);
  
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');
  
  // Calculate budget vs actual for each category
  const budgetComparison = budgets.map(budget => {
    const category = budget.category.toLowerCase();
    const spent = categoryTotals[category] || 0;
    const percentage = Math.min(100, Math.round((spent / budget.amount) * 100)) || 0;
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage
    };
  });
  
  // Pie chart data
  const pieData = budgets.map(budget => ({
    name: budget.category,
    value: budget.amount,
    color: budget.color
  }));
  
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
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Budget Categories</h2>
            <button className="btn-icon">
              <FiPlusCircle size={16} />
            </button>
          </div>
          <div className="card-body">
            {budgetComparison.map(budget => (
              <div key={budget.id} style={budgetItemStyle}>
                <div style={budgetCategoryStyle}>
                  <div style={{ ...categoryCircle, backgroundColor: budget.color }}></div>
                  <div>{budget.category}</div>
                </div>
                
                <div style={budgetBarContainerStyle}>
                  <div style={budgetBarStyle}>
                    <div 
                      style={{
                        ...budgetBarProgressStyle,
                        width: `${budget.percentage}%`,
                        backgroundColor: budget.percentage > 90 ? '#ef4444' : budget.color
                      }}
                    ></div>
                  </div>
                  <div style={budgetPercentStyle}>{budget.percentage}%</div>
                </div>
                
                <div style={budgetAmountStyle}>
                  <div>${budget.spent.toLocaleString('en-US')}</div>
                  <div style={budgetTotalStyle}>of ${budget.amount.toLocaleString('en-US')}</div>
                </div>
                
                <div style={budgetActionsStyle}>
                  <button className="btn-icon">
                    <FiEdit2 size={14} />
                  </button>
                  <button className="btn-icon">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="btn btn-primary">
                <FiPlusCircle size={16} /> Add New Budget Category
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Budget Allocation</h2>
          </div>
          <div className="card-body">
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px 0', borderTop: '1px solid #334155' }}>
              <div className="stats-grid">
                <div>
                  <div className="stat-label">Total Budget</div>
                  <div className="stat-value">${totalBudget.toLocaleString('en-US')}</div>
                </div>
                
                <div>
                  <div className="stat-label">Spent so far</div>
                  <div className="stat-value">${totalExpenses.toLocaleString('en-US')}</div>
                </div>
              </div>
              
              <div className="progress-bar" style={{ marginTop: '15px' }}>
                <div 
                  className="progress-value" 
                  style={{ 
                    width: `${Math.min(100, (totalExpenses / totalBudget) * 100)}%`,
                    backgroundColor: totalExpenses > totalBudget ? '#ef4444' : '#10b981'
                  }}
                ></div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <div style={{ color: totalExpenses <= totalBudget ? '#10b981' : '#ef4444' }}>
                  {totalExpenses <= totalBudget ? "You're under budget. Good job!" : "You've exceeded your budget."}
                </div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginTop: '5px' }}>
                  ${Math.abs(totalBudget - totalExpenses).toLocaleString('en-US')} 
                  {totalExpenses <= totalBudget ? " remaining" : " over budget"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline styles for budget items
const budgetItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid #1e293b'
};

const budgetCategoryStyle = {
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const categoryCircle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%'
};

const budgetBarContainerStyle = {
  flex: '2',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const budgetBarStyle = {
  flex: '1',
  height: '6px',
  backgroundColor: '#334155',
  borderRadius: '3px',
  overflow: 'hidden'
};

const budgetBarProgressStyle = {
  height: '100%',
  borderRadius: '3px'
};

const budgetPercentStyle = {
  width: '40px',
  fontSize: '12px',
  color: '#94a3b8'
};

const budgetAmountStyle = {
  flex: '1',
  textAlign: 'right'
};

const budgetTotalStyle = {
  fontSize: '12px',
  color: '#94a3b8'
};

const budgetActionsStyle = {
  display: 'flex',
  gap: '4px',
  marginLeft: '15px'
};