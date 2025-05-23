import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddIncomeModal({ onClose, onAddIncome, darkMode = false }) {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount) {
      return;
    }
    
    onAddIncome(parseFloat(amount));
  };
  
  // Theme-aware styles with proper contrast
  const theme = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    textColor: darkMode ? '#ffffff' : '#000000', // BLACK text for light mode
    mutedTextColor: darkMode ? '#94a3b8' : '#374151', // DARK GRAY for light mode
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
    color: theme.textColor, // BLACK in light mode, WHITE in dark mode
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
    color: 'black', // Always white text for primary buttons
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
    color: theme.textColor, // BLACK in light mode, WHITE in dark mode
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
            Add Income
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
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}