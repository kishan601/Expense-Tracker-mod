const API_BASE_URL = '/api';

export const api = {
  // Wallet endpoints
  getWallet: async () => {
    const response = await fetch(`${API_BASE_URL}/wallet`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallet data');
    }
    return response.json();
  },
  
  addIncome: async (amount) => {
    const response = await fetch(`${API_BASE_URL}/wallet/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add income');
    }
    return response.json();
  },
  
  // Expenses endpoints
  getExpenses: async () => {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },
  
  getExpense: async (id) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return response.json();
  },
  
  addExpense: async (data) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add expense');
    }
    return response.json();
  },
  
  updateExpense: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update expense');
    }
    return response.json();
  },
  
  deleteExpense: async (id) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    return true;
  },
};