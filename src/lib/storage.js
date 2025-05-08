/**
 * Load data from local storage
 * @returns {Object|null} The stored data or null if none exists
 */
export const loadDataFromLocalStorage = () => {
    try {
      const data = localStorage.getItem('expense_tracker_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return null;
    }
  };
  
  /**
   * Save data to local storage
   * @param {Object} data The data to save
   */
  export const saveDataToLocalStorage = (data) => {
    try {
      localStorage.setItem('expense_tracker_data', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  };
  
  /**
   * Calculate total expenses
   * @param {Array} expenses The array of expenses
   * @returns {number} The total amount
   */
  export const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };
  
  /**
   * Calculate category totals
   * @param {Array} expenses The array of expenses
   * @returns {Object} An object with category totals
  /**
 * Calculate category totals
 * @param {Array} expenses The array of expenses
 * @returns {Object} An object with category totals
 */
export const calculateCategoryTotals = (expenses) => {
    const result = {
      food: 0,
      entertainment: 0,
      travel: 0,
      study: 0,
      utilities: 0,
      electronics: 0,
      other: 0
    };
    
    expenses.forEach(expense => {
      const category = expense.category ? expense.category.toLowerCase() : 'other';
      if (result.hasOwnProperty(category)) {
        result[category] += parseFloat(expense.amount);
      } else {
        result.other += parseFloat(expense.amount);
      }
    });
    
    return result;
  };