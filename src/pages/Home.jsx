import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiMoon, FiSun } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadDataFromLocalStorage, saveDataToLocalStorage, calculateCategoryTotals } from '../lib/storage';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import AddIncomeModal from '../components/modals/AddIncomeModal';
import EditExpenseModal from '../components/modals/EditExpenseModal';
import BudgetEditModal from '../components/modals/BudgetEditModal';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, LineChart, Line,
  Tooltip, Legend, XAxis, YAxis
} from 'recharts';
import '../App.css';

export default function Home({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState({ id: 1, balance: "2000" });
  const [expenses, setExpenses] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showBudgetEditModal, setShowBudgetEditModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  
  // Budget settings - now from state
  const [monthlyBudget, setMonthlyBudget] = useState(8000);
  const [savingsGoal, setSavingsGoal] = useState(15000);

  // Calculate category totals
  const categoryTotals = calculateCategoryTotals(expenses);
  
  // Prepare chart data
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
  
  // Weekly spending data
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const dayOfWeek = expenseDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayMap = {
          'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
        };
        return dayMap[day] === dayOfWeek;
      });
      const totalForDay = dayExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      return {
        day,
        amount: totalForDay
      };
    });
    return data;
  };

  // Get top expense categories for pie chart
  const getTopCategories = () => {
    const categoryData = prepareCategoryData();
    // Take top 3 categories and group the rest as "Other"
    if (categoryData.length <= 3) return categoryData;
    
    const top3 = categoryData.slice(0, 3);
    const otherTotal = categoryData.slice(3).reduce((sum, item) => sum + item.value, 0);
    
    if (otherTotal > 0) {
      top3.push({ name: 'Other', value: otherTotal, color: '#94a3b8' });
    }
    
    return top3;
  };

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const localData = loadDataFromLocalStorage();
        if (localData) {
          setWallet(localData.wallet);
          setExpenses(localData.expenses);
          
          // Load saved budget settings if they exist
          if (localData.budgetSettings) {
            setMonthlyBudget(localData.budgetSettings.monthlyBudget || 8000);
            setSavingsGoal(localData.budgetSettings.savingsGoal || 15000);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle budget settings update
  const handleBudgetSettingsUpdate = (data) => {
    const { monthlyBudget: newBudget, savingsGoal: newGoal } = data;
    
    setMonthlyBudget(newBudget);
    setSavingsGoal(newGoal);
    
    // Save to local storage with updated budget settings
    const budgetSettings = {
      monthlyBudget: newBudget,
      savingsGoal: newGoal
    };
    
    saveDataToLocalStorage({ 
      wallet, 
      expenses,
      budgetSettings
    });
    
    toast.success("Budget settings updated");
  };

  const handleAddIncome = (amount) => {
    try {
      const newBalance = parseFloat(wallet.balance) + amount;
      const updatedWallet = { ...wallet, balance: newBalance.toString() };
      setWallet(updatedWallet);
      
      // Save with current budget settings
      const budgetSettings = {
        monthlyBudget,
        savingsGoal
      };
      
      saveDataToLocalStorage({ 
        wallet: updatedWallet, 
        expenses,
        budgetSettings
      });
      
      toast.success("Income added successfully");
    } catch (error) {
      toast.error("Failed to add income");
    }
  };

  const handleAddExpense = (data) => {
    try {
      const newExpense = {
        id: Date.now(),
        title: data.title,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date,
        created_at: new Date()
      };
      
      const newBalance = parseFloat(wallet.balance) - parseFloat(data.amount);
      if (newBalance < 0) {
        toast.error("Insufficient funds in wallet");
        return;
      }
      
      const updatedWallet = { ...wallet, balance: newBalance.toString() };
      setWallet(updatedWallet);
      
      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
      
      // Save with current budget settings
      const budgetSettings = {
        monthlyBudget,
        savingsGoal
      };
      
      saveDataToLocalStorage({ 
        wallet: updatedWallet, 
        expenses: updatedExpenses,
        budgetSettings
      });
      
      toast.success("Expense added successfully");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setShowEditExpenseModal(true);
  };

  const handleUpdateExpense = (id, data) => {
    try {
      const expenseToUpdate = expenses.find(e => e.id === id);
      if (!expenseToUpdate) return;
      
      const oldAmount = parseFloat(expenseToUpdate.amount);
      const newAmount = parseFloat(data.amount || oldAmount);
      const amountDiff = oldAmount - newAmount;
      
      const updatedExpense = { 
        ...expenseToUpdate, 
        title: data.title || expenseToUpdate.title,
        amount: newAmount,
        category: data.category || expenseToUpdate.category,
        date: data.date || expenseToUpdate.date
      };
      
      const updatedExpenses = expenses.map(expense => 
        expense.id === id ? updatedExpense : expense
      );
      
      setExpenses(updatedExpenses);
      
      if (amountDiff !== 0) {
        const newBalance = parseFloat(wallet.balance) + amountDiff;
        if (newBalance < 0) {
          toast.error("Insufficient funds in wallet");
          return;
        }
        
        const updatedWallet = { ...wallet, balance: newBalance.toString() };
        setWallet(updatedWallet);
        
        // Save with current budget settings
        const budgetSettings = {
          monthlyBudget,
          savingsGoal
        };
        
        saveDataToLocalStorage({ 
          wallet: updatedWallet, 
          expenses: updatedExpenses,
          budgetSettings
        });
      } else {
        // Save with current budget settings
        const budgetSettings = {
          monthlyBudget,
          savingsGoal
        };
        
        saveDataToLocalStorage({ 
          wallet, 
          expenses: updatedExpenses,
          budgetSettings
        });
      }
      
      toast.success("Expense updated successfully");
    } catch (error) {
      toast.error("Failed to update expense");
    }
  };

  const handleDeleteExpense = (id) => {
    try {
      const expenseToDelete = expenses.find(e => e.id === id);
      if (!expenseToDelete) return;
      
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      
      const newBalance = parseFloat(wallet.balance) + parseFloat(expenseToDelete.amount);
      const updatedWallet = { ...wallet, balance: newBalance.toString() };
      setWallet(updatedWallet);
      
      // Save with current budget settings
      const budgetSettings = {
        monthlyBudget,
        savingsGoal
      };
      
      saveDataToLocalStorage({ 
        wallet: updatedWallet, 
        expenses: updatedExpenses,
        budgetSettings
      });
      
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Format current date
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const budgetPercentage = Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100));
  const savingsPercentage = Math.min(100, Math.round((parseFloat(wallet.balance) / savingsGoal) * 100));

  // Get top category if expenses exist
  const topCategory = expenses.length > 0 
    ? Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0] 
    : 'Travel';

  // Weekly data
  const weeklyData = generateWeeklyData();
  
  // Top category data for pie chart
  const topCategoriesData = getTopCategories();

  // Average expense calculation
  const avgExpense = expenses.length > 0 
    ? Math.round(totalExpenses / expenses.length) 
    : 0;

  // Last expense
  const lastExpense = expenses.length > 0 
    ? expenses[0] 
    : { category: topCategory, amount: 0 };

  // Toggle theme handler
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="app-container">
      {/* Header separator */}
      <div className="app-header-separator"></div>
      
      {/* Header */}
      <div className="header-container">
        <h1 className="header-title">Expense Tracker</h1>
        
        <div className="header-date">
          <FiCalendar />
          <span>{currentDate}</span>
        </div>
        
        <div className="header-actions">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          
          <div className="main-nav">
            <Link to="/reports">Reports</Link>
            <Link to="/budgets">Budgets</Link>
            <Link to="/bills">Bills</Link>
          </div>
          
          <button className="btn btn-primary" onClick={() => setShowAddExpenseModal(true)}>
            + Add Expense
          </button>
          
          <button className="btn btn-outline" onClick={() => setShowAddIncomeModal(true)}>
            + Add Income
          </button>
        </div>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Enhanced Wallet Card */}
        <div className="wallet-card">
          <div className="wallet-balance-container">
            <div className="wallet-label">Wallet Balance</div>
            <div className="wallet-balance-wrapper">
              <div className="wallet-balance-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div className="wallet-amount-container">
                <span className="wallet-currency">$</span>
                <span className="wallet-amount-value">{parseFloat(wallet.balance).toLocaleString()}</span>
              </div>
            </div>
            <div className="wallet-trend">
              <div className="wallet-trend-icon positive">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <span className="wallet-trend-label">Healthy Balance</span>
            </div>
            <button 
              className="wallet-add-btn" 
              onClick={() => setShowAddIncomeModal(true)}
            >
              + Add Income
            </button>
          </div>
          
          <div className="wallet-savings-container">
            <div className="wallet-savings-header">
              <div className="wallet-label">Savings Goal</div>
              <button 
                className="edit-button" 
                onClick={() => setShowBudgetEditModal(true)}
                aria-label="Edit savings goal"
              >
                <FiEdit2 />
              </button>
            </div>
            <div className="wallet-savings-amount">${savingsGoal.toLocaleString()}</div>
            <div className="savings-progress-info">
              <span className="savings-progress-label">Current Progress</span>
              <span className="savings-progress-value">${parseFloat(wallet.balance).toLocaleString()} of ${savingsGoal.toLocaleString()}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${savingsPercentage}%`,
                  backgroundColor: savingsPercentage > 75 ? '#10B981' : savingsPercentage > 40 ? '#3B82F6' : '#7C3AED'
                }}
              ></div>
            </div>
            <div className="savings-footer">
              <div className="savings-percentage">{savingsPercentage}%</div>
              <div className="savings-estimate">
                {/* Simplified calculation assuming monthly savings of 10% of budget */}
                {parseFloat(wallet.balance) < savingsGoal && (
                  <span>Est. completion in {Math.ceil((savingsGoal - parseFloat(wallet.balance)) / (monthlyBudget * 0.1))} months</span>
                )}
                {parseFloat(wallet.balance) >= savingsGoal && (
                  <span>Goal achieved! 🎉</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Budget Card */}
        <div className="budget-card">
          <div className="budget-header">
            <div className="budget-title">Monthly Budget</div>
            <button 
              className="edit-button" 
              onClick={() => setShowBudgetEditModal(true)}
              aria-label="Edit monthly budget"
            >
              <FiEdit2 />
            </button>
          </div>
          
          {/* Enhanced Budget Amount Display */}
          <div className="budget-amount-container">
            <span className="budget-currency">$</span>
            <span className="budget-amount-value">{monthlyBudget.toLocaleString()}</span>
          </div>
          
          {/* Budget Progress Stats */}
          <div className="budget-stats-grid">
            <div className="budget-stat">
              <div className="budget-stat-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <FiPlus size={18} color="#7C3AED" />
              </div>
              <div className="budget-stat-info">
                <div className="budget-stat-label">Spent</div>
                <div className="budget-stat-value">${totalExpenses.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="budget-stat">
              <div className="budget-stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <FiRefreshCw size={18} color="#10B981" />
              </div>
              <div className="budget-stat-info">
                <div className="budget-stat-label">Remaining</div>
                <div className="budget-stat-value">${(monthlyBudget - totalExpenses).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="budget-progress-section">
            <div className="budget-progress-header">
              <span>Budget Usage</span>
              <span className="budget-progress-percentage" style={{ 
                color: budgetPercentage > 75 ? '#ef4444' : budgetPercentage > 50 ? '#f59e0b' : '#10b981'
              }}>
                {budgetPercentage}%
              </span>
            </div>
            
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${budgetPercentage}%`,
                  backgroundColor: budgetPercentage > 75 ? '#ef4444' : budgetPercentage > 50 ? '#f59e0b' : '#10b981'
                }}
              ></div>
            </div>
          </div>
          
          {/* Top Spending Categories Mini-Bars */}
          {topCategoriesData.length > 0 && (
            <div className="budget-categories-section">
              <h4 className="budget-section-title">Top Spending</h4>
              
              {topCategoriesData.slice(0, 2).map((category, index) => (
                <div className="mini-category" key={index}>
                  <div className="mini-category-info">
                    <div className="mini-category-dot" style={{backgroundColor: category.color}}></div>
                    <span className="mini-category-name">{category.name}</span>
                    <span className="mini-category-amount">${category.value.toLocaleString()}</span>
                  </div>
                  <div className="mini-progress-container">
                    <div className="mini-progress-bar" 
                      style={{
                        width: `${Math.min(100, Math.round((category.value / monthlyBudget) * 100))}%`, 
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {/* Budget Status Indicator */}
              <div className="budget-status">
                {budgetPercentage <= 50 ? (
                  <div className="budget-status-good">On Track</div>
                ) : budgetPercentage <= 75 ? (
                  <div className="budget-status-warning">Watch Spending</div>
                ) : (
                  <div className="budget-status-danger">Over Budget</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Expense Card */}
        <div className="expense-card">
          <div className="expense-header">
            <div className="expense-title">Total Expenses</div>
            <button 
              className="add-expense-btn" 
              onClick={() => setShowAddExpenseModal(true)}
            >
              + Add Expense
            </button>
          </div>
          
          <div className="expense-amount-container">
            <span className="expense-currency">$</span>
            <span className="expense-amount-value">{totalExpenses.toLocaleString()}</span>
          </div>
          
          <div className="expense-summary">
            <div className="expense-summary-ring">
              <svg viewBox="0 0 36 36" className="expense-summary-chart">
                <path
                  className="expense-summary-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="expense-summary-fill"
                  strokeDasharray={`${budgetPercentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="expense-summary-text">
                  {budgetPercentage}%
                </text>
              </svg>
              <div className="expense-summary-label">of budget</div>
            </div>
          </div>
          
          {/* Top Category & Avg. Expense */}
          <div className="expense-metrics-grid">
            <div className="expense-metric">
              <div className="metric-icon" style={{ backgroundColor: `${getCategoryColor(topCategory)}20` }}>
                <div className="category-indicator" 
                  style={{ backgroundColor: getCategoryColor(topCategory) }}
                ></div>
              </div>
              <div className="metric-info">
                <div className="metric-label">Top Category</div>
                <div className="metric-value">{topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}</div>
              </div>
            </div>
            <div className="expense-metric">
              <div className="metric-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </div>
              <div className="metric-info">
                <div className="metric-label">Avg. Expense</div>
                <div className="metric-value">${avgExpense.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Last Expense */}
          <div className="last-expense">
            <div className="last-expense-header">Last Expense</div>
            <div className="last-expense-card">
              {expenses.length > 0 ? (
                <>
                  <div className="last-expense-icon" style={{ backgroundColor: `${getCategoryColor(lastExpense.category)}20` }}>
                    <div className="category-indicator" 
                      style={{ backgroundColor: getCategoryColor(lastExpense.category) }}
                    ></div>
                  </div>
                  <div className="last-expense-info">
                    <div className="last-expense-title">{lastExpense.title || 'Expense'}</div>
                    <div className="last-expense-category">
                      {lastExpense.category.charAt(0).toUpperCase() + lastExpense.category.slice(1)}
                    </div>
                  </div>
                  <div className="last-expense-amount">${lastExpense.amount.toLocaleString()}</div>
                </>
              ) : (
                <div className="no-expense-message">
                  <div>No expenses recorded yet</div>
                  <button 
                    className="btn-small" 
                    onClick={() => setShowAddExpenseModal(true)}
                  >
                    Add your first
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="chart-card category-chart-card">
          <div className="chart-header">
            <h3>Spending by Category</h3>
          </div>
          
          <div className="category-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={topCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="category-legend">
              {topCategoriesData.map((category, index) => (
                <div className="legend-item" key={index}>
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="legend-label">{category.name}</div>
                  <div className="legend-value">${category.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Weekly Chart */}
        <div className="chart-card weekly-chart-card">
          <div className="chart-header">
            <h3>Weekly Spending</h3>
          </div>
          
          <div className="weekly-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Spent']}
                  cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#7c3aed" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="transactions-card">
          <div className="transactions-header">
            <h3>Recent Transactions</h3>
          </div>
          
          <div className="transactions-list">
            {expenses.length > 0 ? (
              expenses.slice(0, 5).map(expense => (
                <div className="transaction-item" key={expense.id}>
                  <div className="transaction-category">
                    <div 
                      className="category-indicator"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    ></div>
                    <div className="transaction-details">
                      <div className="transaction-title">{expense.title}</div>
                      <div className="transaction-date">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="transaction-actions">
                    <div className="transaction-amount">-${expense.amount.toLocaleString()}</div>
                    <div className="transaction-buttons">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEditExpense(expense)}
                        aria-label="Edit transaction"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteExpense(expense.id)}
                        aria-label="Delete transaction"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <p>No transactions yet</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowAddExpenseModal(true)}
                >
                  Add Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {showAddExpenseModal && (
        <AddExpenseModal 
          onClose={() => setShowAddExpenseModal(false)}
          onAddExpense={handleAddExpense}
        />
      )}
      
      {showAddIncomeModal && (
        <AddIncomeModal 
          onClose={() => setShowAddIncomeModal(false)}
          onAddIncome={handleAddIncome}
        />
      )}
      
      {showEditExpenseModal && currentExpense && (
        <EditExpenseModal 
          expense={currentExpense}
          onClose={() => {
            setShowEditExpenseModal(false);
            setCurrentExpense(null);
          }}
          onUpdateExpense={(data) => handleUpdateExpense(currentExpense.id, data)}
        />
      )}
      
      {showBudgetEditModal && (
        <BudgetEditModal 
          currentBudget={monthlyBudget}
          currentSavingsGoal={savingsGoal}
          onClose={() => setShowBudgetEditModal(false)}
          onUpdateBudgetSettings={handleBudgetSettingsUpdate}
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
}