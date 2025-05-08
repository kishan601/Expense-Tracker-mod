import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './CategoryPieChart.css';

export default function CategoryPieChart({ data, monthlyBudget, currentBudget }) {
  const percentage = Math.round((currentBudget / monthlyBudget) * 100);
  
  return (
    <div className="category-chart-card">
      <div className="category-header">
        <h2>Budget Overview</h2>
        <span className="budget-progress">{percentage}% used</span>
      </div>
      
      <div className="category-chart-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Amount']}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  borderColor: 'var(--tooltip-border)',
                  color: 'var(--tooltip-text)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="chart-center-text">
            <div className="spending-percent">{percentage}%</div>
            <div className="spending-label">of budget</div>
          </div>
        </div>
        
        <div className="category-legend">
          {data.map((entry, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
              <div className="legend-text">
                <span className="legend-name">{entry.name}</span>
                <span className="legend-value">₹{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="budget-info">
        <div className="budget-item">
          <span className="budget-label">Monthly Budget</span>
          <span className="budget-value">₹{monthlyBudget.toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Spent so far</span>
          <span className="budget-value">₹{currentBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}