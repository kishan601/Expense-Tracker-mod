import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddBillModal({ darkMode, onClose, onAddBill }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('Utilities');
  const [recurring, setRecurring] = useState('monthly');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate || !category) {
      return;
    }
    
    onAddBill({
      name,
      amount,
      dueDate,
      category,
      recurring
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
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Bill</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Bill Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electricity Bill"
                className="form-control"
                style={{ backgroundColor: theme.inputBg, color: theme.text }}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="form-control"
                style={{ backgroundColor: theme.inputBg, color: theme.text }}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                style={{ backgroundColor: theme.inputBg, color: theme.text }}
                required
              >
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Transportation">Transportation</option>
                <option value="Insurance">Insurance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-control"
                style={{ backgroundColor: theme.inputBg, color: theme.text }}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Recurring</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className="form-control"
                style={{ backgroundColor: theme.inputBg, color: theme.text }}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </select>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}