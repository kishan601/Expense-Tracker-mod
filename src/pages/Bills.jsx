import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiEdit2, FiTrash2, FiPlusCircle, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

// Updated border styles with more spacing
const cardStyle = {
  position: 'relative',
  margin: '15px',
  zIndex: 1
};

const firstBorderStyle = {
  position: 'absolute',
  top: '-25px',
  left: '-25px',
  right: '-25px',
  bottom: '-25px',
  borderRadius: '16px',
  border: '1px solid rgba(124, 58, 237, 0.15)',
  zIndex: -1
};

const secondBorderStyle = {
  position: 'absolute',
  top: '-45px',
  left: '-45px',
  right: '-45px',
  bottom: '-45px',
  borderRadius: '16px',
  border: '1px solid rgba(124, 58, 237, 0.08)',
  zIndex: -2
};

// Import the modal components
const AddBillModal = ({ onClose, onAddBill, darkMode }) => {
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
      amount: parseFloat(amount),
      dueDate,
      category,
      recurring
    });
  };
  
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
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Recurring</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className="form-control"
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
};

const EditBillModal = ({ bill, onClose, onUpdateBill, darkMode }) => {
  const [name, setName] = useState(bill.name);
  const [amount, setAmount] = useState(bill.amount);
  const [dueDate, setDueDate] = useState(bill.dueDate);
  const [category, setCategory] = useState(bill.category);
  const [recurring, setRecurring] = useState(bill.recurring || 'monthly');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate || !category) {
      return;
    }
    
    onUpdateBill({
      name,
      amount,
      dueDate,
      category,
      recurring
    });
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Bill</h2>
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
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Recurring</label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value)}
                className="form-control"
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
              Update Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Bills() {
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy • h:mm a');
  const today = new Date();
  
  // State for modals
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [showEditBillModal, setShowEditBillModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  
  // Get bills from localStorage or use defaults if not found
  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem('expense_tracker_bills');
    if (savedBills) {
      return JSON.parse(savedBills);
    }
    
    // Default bills if none in localStorage
    return [
      { 
        id: 1, 
        name: 'Rent', 
        amount: 1200, 
        dueDate: format(addDays(today, 10), 'yyyy-MM-dd'), 
        status: 'upcoming', 
        recurring: 'monthly',
        category: 'Housing'
      },
      { 
        id: 2, 
        name: 'Electricity', 
        amount: 85, 
        dueDate: format(addDays(today, 5), 'yyyy-MM-dd'), 
        status: 'upcoming', 
        recurring: 'monthly',
        category: 'Utilities'
      },
      { 
        id: 3, 
        name: 'Internet', 
        amount: 60, 
        dueDate: format(addDays(today, 15), 'yyyy-MM-dd'), 
        status: 'upcoming', 
        recurring: 'monthly',
        category: 'Utilities'
      },
      { 
        id: 4, 
        name: 'Netflix', 
        amount: 15, 
        dueDate: format(addDays(today, -5), 'yyyy-MM-dd'), 
        status: 'paid', 
        paidDate: format(addDays(today, -5), 'yyyy-MM-dd'),
        recurring: 'monthly',
        category: 'Entertainment'
      },
      { 
        id: 5, 
        name: 'Gym Membership', 
        amount: 50, 
        dueDate: format(addDays(today, -2), 'yyyy-MM-dd'), 
        status: 'paid', 
        paidDate: format(addDays(today, -2), 'yyyy-MM-dd'),
        recurring: 'monthly',
        category: 'Health'
      }
    ];
  });
  
  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expense_tracker_bills', JSON.stringify(bills));
  }, [bills]);
  
  // Filter bills by status
  const upcomingBills = bills.filter(bill => bill.status === 'upcoming');
  const paidBills = bills.filter(bill => bill.status === 'paid');
  
  // Calculate total upcoming and paid
  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  
  // Get bills due soon (within 7 days)
  const billsDueSoon = upcomingBills.filter(bill => {
    const dueDate = parseISO(bill.dueDate);
    return isBefore(dueDate, addDays(today, 7));
  });
  
  const markAsPaid = (id) => {
    setBills(prev => prev.map(bill => 
      bill.id === id 
        ? { ...bill, status: 'paid', paidDate: format(today, 'yyyy-MM-dd') }
        : bill
    ));
  };
  
  const handleEditBill = (bill) => {
    setCurrentBill(bill);
    setShowEditBillModal(true);
  };
  
  const handleAddBill = (billData) => {
    const newBill = {
      id: Date.now(),
      name: billData.name,
      amount: parseFloat(billData.amount),
      dueDate: billData.dueDate,
      category: billData.category,
      recurring: billData.recurring || 'monthly',
      status: 'upcoming'
    };
    
    setBills(prev => [newBill, ...prev]);
  };
  
  const handleUpdateBill = (id, updates) => {
    setBills(prev => prev.map(bill => 
      bill.id === id 
        ? { 
            ...bill, 
            name: updates.name || bill.name,
            amount: parseFloat(updates.amount) || bill.amount,
            dueDate: updates.dueDate || bill.dueDate,
            category: updates.category || bill.category,
            recurring: updates.recurring || bill.recurring
          } 
        : bill
    ));
  };
  
  const handleDeleteBill = (id) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };
  
  const getBillStatusStyle = (bill) => {
    if (bill.status === 'paid') {
      return { color: '#10b981' };
    }
    
    const dueDate = parseISO(bill.dueDate);
    if (isBefore(dueDate, today)) {
      return { color: '#ef4444' }; // overdue
    }
    if (isBefore(dueDate, addDays(today, 3))) {
      return { color: '#f59e0b' }; // due soon
    }
    return { color: '#94a3b8' }; // upcoming
  };
  
  const getBillStatusText = (bill) => {
    if (bill.status === 'paid') {
      return 'Paid';
    }
    
    const dueDate = parseISO(bill.dueDate);
    if (isBefore(dueDate, today)) {
      return 'Overdue';
    }
    if (isBefore(dueDate, addDays(today, 3))) {
      return 'Due soon';
    }
    return 'Upcoming';
  };
  
  return (
    <div className="app-container">
      <div className="app-header-separator"></div>
      
      <div className="header-container">
        <Link to="/" className="btn btn-outline">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        
        <h1 className="header-title">Bill Management</h1>
        
        <div className="header-date">
          <FiCalendar />
          <span>{currentDate}</span>
        </div>
      </div>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '45px' }}>
        <div className="card" style={cardStyle}>
          <div style={firstBorderStyle}></div>
          <div style={secondBorderStyle}></div>
          <div className="card-header">
            <h2 className="card-title">Bills Due Soon</h2>
          </div>
          <div className="card-body">
            {billsDueSoon.length > 0 ? (
              <div>
                {billsDueSoon.map(bill => (
                  <div key={bill.id} style={billItemStyle}>
                    <div style={billNameStyle}>
                      <div>{bill.name}</div>
                      <div style={billCategoryStyle}>{bill.category}</div>
                    </div>
                    <div style={billAmountStyle}>${bill.amount}</div>
                    <div style={{ ...billDateStyle, ...getBillStatusStyle(bill) }}>
                      {format(parseISO(bill.dueDate), 'MMM d, yyyy')}
                    </div>
                    <button 
                      className="btn btn-success btn-sm" 
                      style={billButtonStyle}
                      onClick={() => markAsPaid(bill.id)}
                    >
                      <FiCheckCircle size={14} /> Mark Paid
                    </button>
                  </div>
                ))}
                
                <div style={{ marginTop: '15px' }}>
                  <div className="stats-grid">
                    <div>
                      <div className="stat-label">Due Soon</div>
                      <div className="stat-value">${billsDueSoon.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString('en-US')}</div>
                    </div>
                    <div>
                      <div className="stat-label">Bills Count</div>
                      <div className="stat-value">{billsDueSoon.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No bills due soon</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card" style={cardStyle}>
          <div style={firstBorderStyle}></div>
          <div style={secondBorderStyle}></div>
          <div className="card-header">
            <h2 className="card-title">Upcoming Bills</h2>
          </div>
          <div className="card-body">
            {upcomingBills.length > 0 ? (
              <div>
                {upcomingBills.map(bill => (
                  <div key={bill.id} style={billItemStyle}>
                    <div style={billNameStyle}>
                      <div>{bill.name}</div>
                      <div style={billCategoryStyle}>{bill.category}</div>
                    </div>
                    <div style={billAmountStyle}>${bill.amount}</div>
                    <div style={{ ...billDateStyle, ...getBillStatusStyle(bill) }}>
                      {getBillStatusText(bill)}
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '15px' }}>
                  <div className="stats-grid">
                    <div>
                      <div className="stat-label">Total Upcoming</div>
                      <div className="stat-value">${totalUpcoming.toLocaleString('en-US')}</div>
                    </div>
                    <div>
                      <div className="stat-label">Bills Count</div>
                      <div className="stat-value">{upcomingBills.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No upcoming bills</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card" style={cardStyle}>
          <div style={firstBorderStyle}></div>
          <div style={secondBorderStyle}></div>
          <div className="card-header">
            <h2 className="card-title">Recently Paid</h2>
          </div>
          <div className="card-body">
            {paidBills.length > 0 ? (
              <div>
                {paidBills.map(bill => (
                  <div key={bill.id} style={billItemStyle}>
                    <div style={billNameStyle}>
                      <div>{bill.name}</div>
                      <div style={billCategoryStyle}>{bill.category}</div>
                    </div>
                    <div style={billAmountStyle}>${bill.amount}</div>
                    <div style={{ ...billDateStyle, color: '#10b981' }}>
                      Paid on {format(parseISO(bill.paidDate), 'MMM d')}
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '15px' }}>
                  <div className="stats-grid">
                    <div>
                      <div className="stat-label">Total Paid</div>
                      <div className="stat-value">${totalPaid.toLocaleString('en-US')}</div>
                    </div>
                    <div>
                      <div className="stat-label">Bills Count</div>
                      <div className="stat-value">{paidBills.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No recently paid bills</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card" style={{...cardStyle, marginTop: '45px'}}>
        <div style={firstBorderStyle}></div>
        <div style={secondBorderStyle}></div>
        <div className="card-header">
          <h2 className="card-title">All Bills</h2>
          <button className="btn-icon" onClick={() => setShowAddBillModal(true)}>
            <FiPlusCircle size={16} />
          </button>
        </div>
        <div className="card-body">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Bill Name</th>
                <th style={tableHeaderStyle}>Category</th>
                <th style={tableHeaderStyle}>Amount</th>
                <th style={tableHeaderStyle}>Due Date</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{bill.name}</td>
                  <td style={tableCellStyle}>{bill.category}</td>
                  <td style={tableCellStyle}>${bill.amount}</td>
                  <td style={tableCellStyle}>{format(parseISO(bill.dueDate), 'MMM d, yyyy')}</td>
                  <td style={{ ...tableCellStyle, ...getBillStatusStyle(bill) }}>
                    {getBillStatusText(bill)}
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" onClick={() => handleEditBill(bill)}>
                        <FiEdit2 size={14} />
                      </button>
                      {bill.status !== 'paid' && (
                        <button className="btn-icon" onClick={() => markAsPaid(bill.id)}>
                          <FiCheckCircle size={14} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => handleDeleteBill(bill.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={() => setShowAddBillModal(true)}>
              <FiPlusCircle size={16} /> Add New Bill
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Bill Modal */}
      {showAddBillModal && (
        <AddBillModal
          onClose={() => setShowAddBillModal(false)}
          onAddBill={(data) => {
            handleAddBill(data);
            setShowAddBillModal(false);
          }}
        />
      )}
      
      {/* Edit Bill Modal */}
      {showEditBillModal && currentBill && (
        <EditBillModal
          bill={currentBill}
          onClose={() => {
            setShowEditBillModal(false);
            setCurrentBill(null);
          }}
          onUpdateBill={(data) => {
            handleUpdateBill(currentBill.id, data);
            setShowEditBillModal(false);
            setCurrentBill(null);
          }}
        />
      )}
    </div>
  );
}

// Inline styles
const billItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #1e293b'
};

const billNameStyle = {
  flex: '2'
};

const billCategoryStyle = {
  fontSize: '12px',
  color: '#94a3b8'
};

const billAmountStyle = {
  flex: '1',
  textAlign: 'right',
  fontWeight: '500'
};

const billDateStyle = {
  flex: '1.5',
  textAlign: 'right',
  fontSize: '13px'
};

const billButtonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  fontSize: '12px'
};

const tableHeaderStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  borderBottom: '1px solid #334155',
  color: '#94a3b8',
  fontSize: '14px'
};

const tableRowStyle = {
  borderBottom: '1px solid #1e293b'
};

const tableCellStyle = {
  padding: '12px 16px',
  fontSize: '14px'
};