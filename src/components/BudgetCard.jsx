import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../lib/types';
import './BudgetCard.css';

export default function BudgetCard({ 
  totalExpenses,
  monthlyBudget,
  expenses 
}) {
  // Calculate percentage of budget used
  const budgetPercentage = Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100));
  const remaining = monthlyBudget - totalExpenses;
  
  // Get category distribution
  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {})
  ).map(([category, value]) => ({
    name: category,
    value: parseFloat(value)
  }));
  
  // If no expenses, add dummy data for the pie chart
  const pieData = categoryData.length > 0 
    ? categoryData 
    : [{ name: 'No Data', value: 1 }];
  
  // Budget status message
  const statusMessage = remaining > 0 
    ? `You're under budget. Good job!` 
    : `You've exceeded your budget!`;
  
  return (
    <div className="card budget-card">
      <div className="card-header">
        <h2 className="card-title">Budget Overview</h2>
        <div className="budget-percentage">{budgetPercentage}% used</div>
      </div>
      
      <div className="card-body">
        <div className="budget-chart">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name] || '#ccc'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="budget-center">
            <div className="budget-center-percentage">{budgetPercentage}%</div>
            <div className="budget-center-label">of budget</div>
          </div>
        </div>
        
        <div className="category-legend">
          {categoryData.map((entry, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#ccc' }}
              ></div>
              <div className="legend-name">{entry.name}</div>
            </div>
          ))}
        </div>
        
        <div className="budget-stats">
          <div className="budget-stat">
            <div className="stat-label">Monthly Budget</div>
            <div className="stat-value">${monthlyBudget.toLocaleString('en-US')}</div>
          </div>
          
          <div className="budget-stat">
            <div className="stat-label">Spent so far</div>
            <div className="stat-value">${totalExpenses.toLocaleString('en-US')}</div>
          </div>
        </div>
        
        <div className="budget-status">
          <div className="status-message">{statusMessage}</div>
          <div className="status-remaining">${Math.abs(remaining).toLocaleString('en-US')} {remaining > 0 ? 'remaining' : 'over budget'}</div>
        </div>
        
        <div className="budget-actions">
          <button className="btn btn-outline">Reports</button>
          <button className="btn btn-outline">Budgets</button>
          <button className="btn btn-outline">Bills</button>
        </div>
      </div>
    </div>
  );
}