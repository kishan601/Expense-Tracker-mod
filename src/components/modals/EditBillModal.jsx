import React, { useState } from 'react';
import { FiX, FiCalendar, FiDollarSign } from 'react-icons/fi';

export default function EditBillModal({ 
  darkMode, 
  bill, 
  onClose, 
  onSave 
}) {
  const [billData, setBillData] = useState({
    name: bill.name || '',
    amount: bill.amount || '',
    dueDate: bill.dueDate || '',
    category: bill.category || 'utilities',
    recurring: bill.recurring || false,
    frequency: bill.frequency || 'monthly'
  });

  const handleChange = (field, value) => {
    setBillData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!billData.name || !billData.amount || !billData.dueDate) {
      return;
    }
    
    const updatedBill = {
      ...bill,
      ...billData,
      amount: parseFloat(billData.amount)
    };
    
    onSave(updatedBill);
  };

  // Theme colors
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
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: `1px solid ${theme.border}`
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

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${theme.mutedText.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    accentColor: '#7c3aed'
  };

  const buttonPrimaryStyle = {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  };

  const buttonSecondaryStyle = {
    backgroundColor: 'transparent',
    color: theme.mutedText,
    border: `1px solid ${theme.border}`,
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '22px', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FiDollarSign />
            Edit Bill
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: theme.mutedText,
              fontSize: '20px',
              padding: '5px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.text;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.mutedText;
            }}
          >
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {/* Bill Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.mutedText
              }}>
                Bill Name
              </label>
              <input
                type="text"
                value={billData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Electricity Bill"
                style={inputStyle}
                required
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.mutedText
              }}>
                Amount
              </label>
              <input
                type="number"
                value={billData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                style={inputStyle}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Due Date */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.mutedText
              }}>
                Due Date
              </label>
              <input
                type="date"
                value={billData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.mutedText
              }}>
                Category
              </label>
              <select
                value={billData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                style={selectStyle}
              >
                <option value="utilities">Utilities</option>
                <option value="rent">Rent/Mortgage</option>
                <option value="insurance">Insurance</option>
                <option value="subscription">Subscriptions</option>
                <option value="loan">Loans</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Recurring Checkbox */}
            <div style={checkboxContainerStyle}>
              <input
                type="checkbox"
                id="recurring"
                checked={billData.recurring}
                onChange={(e) => handleChange('recurring', e.target.checked)}
                style={checkboxStyle}
              />
              <label 
                htmlFor="recurring"
                style={{
                  fontSize: '14px',
                  color: theme.text,
                  cursor: 'pointer'
                }}
              >
                This is a recurring bill
              </label>
            </div>

            {/* Frequency (only show if recurring) */}
            {billData.recurring && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.mutedText
                }}>
                  Frequency
                </label>
                <select
                  value={billData.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                  style={selectStyle}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: `1px solid ${theme.border}`
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={buttonSecondaryStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.inputBg;
                e.target.style.borderColor = '#7c3aed';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = theme.border;
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={buttonPrimaryStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6d28d9';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#7c3aed';
              }}
            >
              Update Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}