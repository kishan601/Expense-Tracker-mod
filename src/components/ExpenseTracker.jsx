import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import WalletCard from './WalletCard';
import ExpenseCard from './ExpenseCard';
import CategoryPieChart from './CategoryPieChart';
import TransactionList from './TransactionList';
import { ThemeToggle } from './ThemeToggle';
import AddExpenseModal from './modals/AddExpenseModal';
import AddIncomeModal from './modals/AddIncomeModal';
import EditExpenseModal from './modals/EditExpenseModal';
import { CATEGORY_COLORS } from '../lib/types';
import { calculateTotalExpenses, calculateCategoryTotals } from '../lib/storage';
import { downloadExpensesAsCSV, generateCSVFilename } from '../lib/csvUtils';
import './ExpenseTracker.css';

// Define constants
const MONTHLY_BUDGET = 8000;
const CURRENT_BUDGET = 3000;

export default function ExpenseTracker({
  wallet,
  expenses,
  onAddIncome,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  darkMode,
  setDarkMode
}) {
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const totalExpenses = calculateTotalExpenses(expenses);
  const categoryTotals = calculateCategoryTotals(expenses);
  
  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setShowEditExpenseModal(true);
  };

  const handleUpdateExpense = (data) => {
    if (currentExpense) {
      onUpdateExpense(currentExpense.id, data);
      setShowEditExpenseModal(false);
      setCurrentExpense(null);
    }
  };

  // Format data for the pie chart
  const pieChartData = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      color: CATEGORY_COLORS[category]
    }));

  // Get current date in the format shown in the design
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');

  return (
    <div className="expense-tracker-container">
      {/* Main Header - This is the only header that should be here */}
      <header className="expense-tracker-header">
        <div className="header-top">
          <div>
            <h1 className="app-title">Expense Tracker</h1>
            <p className="app-subtitle">Manage your finances effectively</p>
          </div>
          <div className="header-actions">
            <nav className="header-nav">
              <Link to="/reports" className="nav-link">Reports</Link>
              <Link to="/budgets" className="nav-link">Budgets</Link>
              <Link to="/bills" className="nav-link">Bills</Link>
              <div className="nav-theme-toggle">
                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>
            </nav>
            <button 
              className="add-expense-button"
              onClick={() => setShowAddExpenseModal(true)}
            >
              + Add Expense
            </button>
            <button 
              className="add-income-button"
              onClick={() => setShowAddIncomeModal(true)}
            >
              + Add Income
            </button>
          </div>
        </div>
        
        {/* Date display */}
        <div className="date-display">
          <span>{currentDate}</span>
        </div>
      </header>
      
      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Wallet */}
        <div className="grid-wallet">
          <WalletCard 
            balance={wallet.balance} 
            onAddIncomeClick={() => setShowAddIncomeModal(true)} 
          />
        </div>
        
        {/* Expenses */}
        <div className="grid-expenses">
          <ExpenseCard 
            totalExpenses={totalExpenses} 
            onAddExpenseClick={() => setShowAddExpenseModal(true)} 
          />
        </div>
        
        {/* Pie Chart */}
        <div className="grid-chart">
          <CategoryPieChart 
            data={pieChartData.length > 0 ? pieChartData : [{ name: "No Data", value: 1, color: "#ccc" }]}
            monthlyBudget={MONTHLY_BUDGET}
            currentBudget={CURRENT_BUDGET}
          />
        </div>
      </div>

      {/* Transactions and Trends */}
      <div className="transactions-container">
        {/* Recent Transactions */}
        <div className="recent-transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            {expenses.length > 0 && (
              <button
                className="export-button"
                onClick={() => downloadExpensesAsCSV(expenses, generateCSVFilename())}
              >
                <FiDownload size={14} />
                <span>Export CSV</span>
              </button>
            )}
          </div>
          
          {expenses.length > 0 ? (
            <TransactionList 
              expenses={expenses} 
              onEdit={handleEditExpense} 
              onDelete={onDeleteExpense} 
            />
          ) : (
            <div className="empty-state">
              <p>No transactions yet.</p>
              <button 
                className="add-first-expense"
                onClick={() => setShowAddExpenseModal(true)}
              >
                Add your first expense
              </button>
            </div>
          )}
        </div>

        {/* Top Expenses Chart */}
        <div className="top-expenses">
          <div className="section-header">
            <h2>Top Expenses</h2>
            <span className="section-subtitle">By Category</span>
          </div>
          
          {totalExpenses > 0 ? (
            <div className="top-expenses-chart">
              {pieChartData
                .sort((a, b) => b.value - a.value)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={index} className="expense-category-item">
                    <div className="category-bar-container">
                      <div className="category-name">{item.name}</div>
                      <div className="category-bar-wrapper">
                        <div 
                          className="category-bar" 
                          style={{ 
                            width: `${Math.min(100, (item.value / (totalExpenses * 0.8)) * 100)}%`,
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                      <div className="category-amount">₹{item.value}</div>
                    </div>
                    <div className="category-percentage">
                      {Math.round((item.value / totalExpenses) * 100)}%
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="empty-state">
              <p>No expense data to display</p>
              <button 
                className="add-first-expense"
                onClick={() => setShowAddExpenseModal(true)}
              >
                Add your first expense
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowAddExpenseModal(false)}
          onAddExpense={(data) => {
            onAddExpense(data);
            setShowAddExpenseModal(false);
          }}
        />
      )}

      {showAddIncomeModal && (
        <AddIncomeModal
          onClose={() => setShowAddIncomeModal(false)}
          onAddIncome={(amount) => {
            onAddIncome(amount);
            setShowAddIncomeModal(false);
          }}
        />
      )}

      {showEditExpenseModal && currentExpense && (
        <EditExpenseModal
          expense={currentExpense}
          onClose={() => {
            setShowEditExpenseModal(false);
            setCurrentExpense(null);
          }}
          onUpdateExpense={handleUpdateExpense}
        />
      )}
    </div>
  );
}