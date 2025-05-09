import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddExpenseModal({ onClose, onAddExpense, darkMode = true }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !amount || !category || !date) {
      return;
    }
    
    onAddExpense({
      title,
      amount,
      category,
      date
    });
  };
  
  // Theme-aware styles
  const theme = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    textColor: darkMode ? '#ffffff' : '#1e293b',
    mutedTextColor: darkMode ? '#94a3b8' : '#64748b',
    inputBackground: darkMode ? '#1e293b' : '#f1f5f9',
    borderColor: darkMode ? '#334155' : '#e2e8f0',
    overlayColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  };
  
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const modalStyle = {
    backgroundColor: theme.backgroundColor,
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    border: `1px solid ${theme.borderColor}`
  };
  
  const modalHeaderStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.borderColor}`
  };
  
  const modalBodyStyle = {
    padding: '20px'
  };
  
  const modalFooterStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  };
  
  const inputGroupStyle = {
    marginBottom: '20px'
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.mutedTextColor
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: theme.inputBackground,
    color: theme.textColor,
    border: `1px solid ${theme.borderColor}`,
    borderRadius: '6px',
    outline: 'none'
  };
  
  const buttonPrimaryStyle = {
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  };
  
  const buttonSecondaryStyle = {
    backgroundColor: 'transparent',
    color: theme.mutedTextColor,
    border: `1px solid ${theme.borderColor}`,
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: theme.textColor }}>Add Expense</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: theme.mutedTextColor,
              fontSize: '20px'
            }}
          >
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={modalBodyStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Expense title"
                style={inputStyle}
                required
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={inputStyle}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="travel">Travel</option>
                <option value="study">Study</option>
                <option value="utilities">Utilities</option>
                <option value="electronics">Electronics</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
          </div>
          
          <div style={modalFooterStyle}>
            <button type="button" onClick={onClose} style={buttonSecondaryStyle}>
              Cancel
            </button>
            <button type="submit" style={buttonPrimaryStyle}>
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}