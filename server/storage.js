class MemStorage {
    constructor() {
      this.users = new Map();
      this.expensesMap = new Map();
      this.wallet = { id: 1, balance: "5000" };
      this.currentUserId = 1;
      this.currentExpenseId = 1;
    }
  
    async getUser(id) {
      return this.users.get(id);
    }
  
    async getUserByUsername(username) {
      return Array.from(this.users.values()).find(
        (user) => user.username === username,
      );
    }
  
    async createUser(insertUser) {
      const id = this.currentUserId++;
      const user = { ...insertUser, id };
      this.users.set(id, user);
      return user;
    }
  
    async getExpenses() {
      return Array.from(this.expensesMap.values()).sort((a, b) => {
        // Sort by date descending (most recent first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  
    async getExpense(id) {
      return this.expensesMap.get(id);
    }
  
    async createExpense(insertExpense) {
      const id = this.currentExpenseId++;
      const expense = { 
        ...insertExpense, 
        id, 
        created_at: new Date() 
      };
      this.expensesMap.set(id, expense);
      
      // Update wallet balance
      await this.updateWalletBalance(-Number(insertExpense.amount));
      
      return expense;
    }
  
    async updateExpense(id, updates) {
      const expense = this.expensesMap.get(id);
      if (!expense) return undefined;
      
      // If amount is being updated, adjust the wallet balance
      if (updates.amount !== undefined) {
        const oldAmount = Number(expense.amount);
        const newAmount = Number(updates.amount);
        const difference = oldAmount - newAmount;
        
        // Update wallet balance with the difference
        await this.updateWalletBalance(difference);
      }
      
      const updatedExpense = { ...expense, ...updates };
      this.expensesMap.set(id, updatedExpense);
      
      return updatedExpense;
    }
  
    async deleteExpense(id) {
      const expense = this.expensesMap.get(id);
      if (!expense) return false;
      
      // Restore the amount to wallet balance
      await this.updateWalletBalance(Number(expense.amount));
      
      return this.expensesMap.delete(id);
    }
  
    async getWallet() {
      return this.wallet;
    }
  
    async updateWalletBalance(amountChange) {
      // Convert current balance to number for calculation, then back to string
      const currentBalance = Number(this.wallet.balance);
      const newBalance = currentBalance + amountChange;
      
      this.wallet = { ...this.wallet, balance: String(newBalance) };
      return this.wallet;
    }
  }
  
  const storage = new MemStorage();
  
  module.exports = storage;