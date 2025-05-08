import React from 'react';
import { FiEdit2, FiTrash2, FiBriefcase, FiCoffee, FiShoppingBag, FiMapPin, FiSmartphone } from 'react-icons/fi';
import { format } from 'date-fns';
import { CATEGORY_COLORS } from '../lib/types';
import './TransactionList.css';

export default function TransactionList({ expenses, onEdit, onDelete }) {
  // Category icons mapping
  const categoryIcons = {
    food: FiShoppingBag,
    entertainment: FiBriefcase,
    travel: FiMapPin,
    study: FiBriefcase,
    utensils: FiCoffee,
    electronics: FiSmartphone
  };
  
  if (expenses.length === 0) {
    return (
      <div className="empty-transactions">
        <p>No transactions yet.</p>
        <p className="add-first">Add your first expense to get started</p>
      </div>
    );
  }
  
  // Sort by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="transaction-list">
      {sortedExpenses.map(expense => {
        const IconComponent = categoryIcons[expense.category] || FiShoppingBag;
        
        return (
          <div key={expense.id} className="transaction-item">
            <div 
              className="transaction-icon"
              style={{ 
                backgroundColor: `${CATEGORY_COLORS[expense.category]}20`, 
                color: CATEGORY_COLORS[expense.category] 
              }}
            >
              <IconComponent size={16} />
            </div>
            
            <div className="transaction-content">
              <div className="transaction-title">{expense.title}</div>
              <div className="transaction-date">
                {format(new Date(expense.date), 'yyyy-MM-dd')}
              </div>
            </div>
            
            <div className="transaction-amount danger">
              {parseFloat(expense.amount).toLocaleString('en-US')}
            </div>
            
            <div className="transaction-actions">
              <button 
                className="transaction-action edit"
                onClick={() => onEdit(expense)}
                aria-label="Edit transaction"
              >
                <FiEdit2 size={14} />
              </button>
              
              <button 
                className="transaction-action delete"
                onClick={() => onDelete(expense.id)}
                aria-label="Delete transaction"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}