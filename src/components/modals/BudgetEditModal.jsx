import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function BudgetEditModal({ 
  darkMode, 
  onClose, 
  onSave, // Make sure it's onSave, not onBudgetUpdate
  currentBudget, 
  currentSavingsGoal 
}) {
  const [monthlyBudget, setMonthlyBudget] = useState(currentBudget);
  const [savingsGoal, setSavingsGoal] = useState(currentSavingsGoal);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!monthlyBudget || !savingsGoal) {
      return;
    }
    
    // Call onSave function with the data (this should match your Home.jsx)
    if (onSave) {
      onSave({
        monthlyBudget: parseFloat(monthlyBudget),
        savingsGoal: parseFloat(savingsGoal)
      });
    }
    
    // Close modal
    onClose();
  };

  // Theme-aware styles with proper contrast
  const theme = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    textColor: darkMode ? '#ffffff' : '#000000',
    mutedTextColor: darkMode ? '#94a3b8' : '#374151',
    inputBackground: darkMode ? '#1e293b' : '#f9fafb',
    borderColor: darkMode ? '#334155' : '#d1d5db',
    overlayColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
  };
  
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.overlayColor,
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
    boxShadow: darkMode ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: `2px solid ${theme.borderColor}`
  };
  
  const modalHeaderStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `2px solid ${theme.borderColor}`
  };
  
  const modalBodyStyle = {
    padding: '20px'
  };
  
  const modalFooterStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    borderTop: `1px solid ${theme.borderColor}`
  };
  
  const inputGroupStyle = {
    marginBottom: '20px'
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.textColor,
    fontWeight: 'bold'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: theme.inputBackground,
    color: theme.textColor,
    border: `2px solid ${theme.borderColor}`,
    borderRadius: '6px',
    outline: 'none'
  };
  
  const buttonPrimaryStyle = {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  };
  
  const buttonSecondaryStyle = {
    backgroundColor: 'transparent',
    color: theme.textColor,
    border: `2px solid ${theme.borderColor}`,
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };
  
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: theme.textColor, fontWeight: 'bold' }}>
            Edit Budget Settings
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: `1px solid ${theme.borderColor}`, 
              cursor: 'pointer',
              color: theme.textColor,
              fontSize: '20px',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={modalBodyStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Monthly Budget</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="0.00"
                style={inputStyle}
                min="0"
                step="1"
                required
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Savings Goal</label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                placeholder="0.00"
                style={inputStyle}
                min="0"
                step="1"
                required
              />
            </div>
          </div>
          
          <div style={modalFooterStyle}>
            <button 
              type="button" 
              onClick={onClose} 
              style={buttonSecondaryStyle}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={buttonPrimaryStyle}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}