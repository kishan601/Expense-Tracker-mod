import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function BudgetEditModal({ 
  darkMode, 
  onClose, 
  onSave, 
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
    
    onSave({
      monthlyBudget: parseFloat(monthlyBudget),
      savingsGoal: parseFloat(savingsGoal)
    });
  };
  
  // Styles based on theme
  const colors = {
    dark: {
      modalBg: '#0f172a',
      inputBg: '#1e293b',
      border: '#334155',
      text: '#ffffff',
      mutedText: '#94a3b8',
      overlay: 'rgba(0, 0, 0, 0.7)'
    },
    light: {
      modalBg: '#ffffff',
      inputBg: '#f1f5f9',
      border: '#cbd5e1',
      text: '#1e293b',
      mutedText: '#64748b',
      overlay: 'rgba(15, 23, 42, 0.5)'
    }
  };
  
  const theme = darkMode ? colors.dark : colors.light;
  
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.overlay,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const modalStyle = {
    backgroundColor: theme.modalBg,
    borderRadius: '10px',
    width: '90%',
    maxWidth: '450px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${theme.border}`
  };
  
  const modalHeaderStyle = {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.border}`
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
    color: theme.mutedText
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: theme.inputBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
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
    color: theme.mutedText,
    border: `1px solid ${theme.border}`,
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  };
  
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={{ margin: 0, fontSize: '20px', color: theme.text }}>Edit Budget Settings</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: theme.mutedText,
              fontSize: '20px'
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
            <button type="button" onClick={onClose} style={buttonSecondaryStyle}>
              Cancel
            </button>
            <button type="submit" style={buttonPrimaryStyle}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}