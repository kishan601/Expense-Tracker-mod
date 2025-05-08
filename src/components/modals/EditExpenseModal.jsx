import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

export default function EditExpenseModal({ expense, onClose, onUpdateExpense }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form with expense data
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date
      });
    }
  }, [expense]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdateExpense({
        ...formData,
        amount: Number(formData.amount)
      });
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Expense</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Expense title"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <p className="error-message">{errors.amount}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            >
              <option value="food">Food</option>
              <option value="entertainment">Entertainment</option>
              <option value="travel">Travel</option>
              <option value="study">Study</option>
              <option value="utensils">Utensils</option>
              <option value="electronics">Electronics</option>
            </select>
            {errors.category && <p className="error-message">{errors.category}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
            >
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}