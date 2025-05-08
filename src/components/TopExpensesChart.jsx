import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../lib/types';
import './TopExpensesChart.css';

export default function TopExpensesChart({ expenses }) {
  // Get category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});
  
  // Format data for bar chart
  const chartData = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total: parseFloat(total)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);  // Take top 5 categories
  
  return (
    <div className="top-expenses-chart">
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis 
                dataKey="category" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)' }}
                width={70}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString('en-US')}`, 'Total']}
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.category] || '#ccc'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          <div className="expenses-by-category">
            {chartData.map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-details">
                  <div 
                    className="category-indicator" 
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#ccc' }}
                  ></div>
                  <div className="category-name">{item.category}</div>
                </div>
                <div className="category-amount">
                  ${item.total.toLocaleString('en-US')}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-data-message">
          <p>No expense data available</p>
        </div>
      )}
    </div>
  );
}