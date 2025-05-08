import React from 'react';
import { FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import './WalletCard.css';

export default function WalletCard({ 
  balance, 
  spent, 
  available, 
  savingsGoal,
  onAddIncome 
}) {
  // Calculate savings progress percentage
  const savingsProgress = Math.min(100, (parseFloat(balance) / savingsGoal) * 100);
  
  // Generate sparkline data (random for demo)
  const sparklineData = Array.from({ length: 12 }, () => 
    Math.floor(Math.random() * 30) + 1
  );
  
  return (
    <div className="card wallet-card">
      <div className="card-header">
        <h2 className="card-title">Wallet Balance</h2>
        <button className="btn-icon" onClick={onAddIncome} aria-label="Add income">
          <FiRefreshCw size={16} />
        </button>
      </div>
      
      <div className="card-body">
        <div className="wallet-amount">${parseFloat(balance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        
        {/* Sparkline chart */}
        <div className="sparkline">
          {sparklineData.map((height, i) => (
            <div 
              key={i} 
              className="sparkline-bar" 
              style={{ 
                height: `${height}px`,
                backgroundColor: i === sparklineData.length - 1 ? '#10b981' : 'rgba(16, 185, 129, 0.5)'
              }}
            ></div>
          ))}
        </div>
        <div className="sparkline-caption">
          <span><FiTrendingUp size={12} /> 12%</span>
        </div>
        
        <div className="wallet-stats">
          <div className="wallet-stat">
            <div className="stat-label">Available</div>
            <div className="stat-value danger">${available.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className="stat-badge">
              <span>60%</span>
            </div>
          </div>
          
          <div className="wallet-stat">
            <div className="stat-label">Spent</div>
            <div className="stat-value">${spent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </div>
        
        <div className="savings-goal">
          <div className="savings-header">
            <div className="savings-label">Savings Goal</div>
            <div className="savings-amount">${savingsGoal.toLocaleString('en-US')}</div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-value" 
              style={{ 
                width: `${savingsProgress}%`,
                backgroundColor: 'var(--primary)'
              }}
            ></div>
          </div>
          
          <div className="savings-meta">
            <span>{Math.round(savingsProgress)}% completed</span>
            <span>${parseFloat(balance).toLocaleString('en-US')} / ${savingsGoal.toLocaleString('en-US')}</span>
          </div>
        </div>
        
        <button className="btn btn-success btn-block" onClick={onAddIncome}>
          <FiRefreshCw size={16} />
          Add Income
        </button>
      </div>
    </div>
  );
}