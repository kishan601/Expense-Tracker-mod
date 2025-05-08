import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { loadDataFromLocalStorage, calculateCategoryTotals } from '../lib/storage';

export default function Reports() {
  const data = loadDataFromLocalStorage() || { expenses: [] };
  const expenses = data.expenses || [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  
  const categoryTotals = calculateCategoryTotals(expenses);
  
  // Prepare data for charts
  const prepareCategoryData = () => {
    const categories = Object.keys(categoryTotals);
    return categories.map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categoryTotals[category],
      color: getCategoryColor(category)
    })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  };
  
  const getCategoryColor = (category) => {
    const colorMap = {
      food: '#ac5ddf',
      entertainment: '#ffc32b',
      travel: '#4bd268',
      study: '#49a7ff',
      utilities: '#ff5c81',
      electronics: '#3ee0cf',
      other: '#94a3b8'
    };
    return colorMap[category.toLowerCase()] || '#94a3b8';
  };
  
  // Group expenses by month
  const getMonthlyExpenses = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = Array(12).fill(0);
    
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const month = expenseDate.getMonth();
      monthlyTotals[month] += parseFloat(expense.amount);
    });
    
    return months.map((month, index) => ({
      name: month,
      amount: monthlyTotals[index]
    }));
  };
  
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');
  const categoryData = prepareCategoryData();
  const monthlyData = getMonthlyExpenses();
  
  return (
    <div className="app-container">
      <div className="app-header-separator"></div>
      
      <div className="header-container">
        <Link to="/" className="btn btn-outline">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        
        <h1 className="header-title">Expense Reports</h1>
        
        <div className="header-date">
          <FiCalendar />
          <span>{currentDate}</span>
        </div>
      </div>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Monthly Spending</h2>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" name="Spending" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Category Breakdown</h2>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="stats-grid" style={{ marginTop: '20px' }}>
              <div>
                <div className="stat-label">Total Expenses</div>
                <div className="stat-value">${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              </div>
              
              <div>
                <div className="stat-label">Number of Transactions</div>
                <div className="stat-value">{expenses.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h2 className="card-title">Expense History</h2>
        </div>
        <div className="card-body">
          {expenses.length > 0 ? (
            <div className="transaction-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Title</th>
                    <th style={tableHeaderStyle}>Category</th>
                    <th style={tableHeaderStyle}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense.id} style={tableRowStyle}>
                      <td style={tableCellStyle}>{new Date(expense.date).toLocaleDateString()}</td>
                      <td style={tableCellStyle}>{expense.title}</td>
                      <td style={tableCellStyle}>{expense.category}</td>
                      <td style={tableCellStyle}>${parseFloat(expense.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No expense history available</p>
              <Link to="/" className="add-first">Add your first expense</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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