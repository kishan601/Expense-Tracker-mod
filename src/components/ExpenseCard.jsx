import React from 'react';
import { FiTrendingDown, FiArrowUpRight, FiPlus } from 'react-icons/fi';
import './ExpenseCard.css';

export default function ExpenseCard({ 
  totalExpenses, 
  expenses, 
  onAddExpense 
}) {
  // Get top category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});
  
  const topCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category)[0] || 'travel';
  
  // Calculate average expense
  const avgExpense = expenses.length 
    ? Math.round(totalExpenses / expenses.length) 
    : 0;
  
  // Get most recent expense
  const lastExpense = expenses.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  // Calculate trend (random for demo)
  const trend = 8;
  
  return (
    <div className="card expense-card">
      <div className="card-header">
        <h2 className="card-title">Expenses</h2>
        <button className="btn-icon" onClick={onAddExpense} aria-label="Add expense">
          <FiPlus size={16} />
        </button>
      </div>
      
      <div className="card-body">
        <div className="expense-amount danger">
          ${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </div>
        
        <div className="expense-trend">
          <FiTrendingDown className="trend-icon" />
          <span className={trend < 0 ? 'success' : 'danger'}>
            {trend}%
          </span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-value" 
            style={{ 
              width: '65%',
              backgroundColor: 'var(--danger)'
            }}
          ></div>
        </div>
        
        <div className="expense-stats">
          <div className="expense-stat">
            <div className="stat-label">Top Category</div>
            <div className="stat-category">
              <div className={`category-indicator ${topCategory}`}></div>
              <div className="category-name">{topCategory}</div>
            </div>
          </div>
          
          <div className="expense-stat">
            <div className="stat-label">Avg. Expense</div>
            <div className="stat-value">
              ${avgExpense.toLocaleString('en-US')}
            </div>
          </div>
        </div>
        
        {lastExpense && (
          <div className="last-expense">
            <div className="last-expense-header">
              <div className="last-expense-label">Last Expense</div>
              <div className="last-expense-date">
                {new Date(lastExpense.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="last-expense-details">
              <div className={`category-icon ${lastExpense.category}`}>
                <div className="category-initial">
                  {lastExpense.category.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="last-expense-info">
                <div className="last-expense-title">{lastExpense.title}</div>
                <div className="last-expense-category">{lastExpense.category}</div>
              </div>
              
              <div className="last-expense-amount danger">
                ${parseFloat(lastExpense.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </div>
            </div>
            
            <div className="last-expense-time">
              {Math.floor(
                (new Date() - new Date(lastExpense.date)) / (1000 * 60 * 60 * 24)
              )} days ago
            </div>
          </div>
        )}
        
        <button className="btn btn-danger btn-block" onClick={onAddExpense}>
          <FiPlus size={16} />
          Add Expense
        </button>
      </div>
    </div>
  );
}