const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// API Routes

// GET wallet balance
app.get("/api/wallet", async (req, res) => {
  try {
    const wallet = await storage.getWallet();
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Failed to get wallet balance" });
  }
});

// POST update wallet balance (add income)
app.post("/api/wallet/income", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    const wallet = await storage.updateWalletBalance(amount);
    res.json(wallet);
  } catch (error) {
    res.status(400).json({ message: "Invalid input data" });
  }
});

// GET all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to get expenses" });
  }
});

// GET single expense
app.get("/api/expenses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await storage.getExpense(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to get expense" });
  }
});

// POST create new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    
    // Check if wallet has enough balance
    const wallet = await storage.getWallet();
    if (Number(wallet.balance) < Number(amount)) {
      return res.status(400).json({ message: "Not enough balance in wallet" });
    }
    
    const expense = await storage.createExpense({
      title,
      amount: Number(amount),
      category,
      date
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Invalid expense data" });
  }
});

// PUT update expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const updates = req.body;
    
    // If updating amount, check if wallet has enough balance
    if (updates.amount !== undefined) {
      const expense = await storage.getExpense(id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      
      const wallet = await storage.getWallet();
      const amountDifference = Number(updates.amount) - Number(expense.amount);
      
      if (amountDifference > 0 && Number(wallet.balance) < amountDifference) {
        return res.status(400).json({ message: "Not enough balance in wallet for this update" });
      }
    }
    
    const updatedExpense = await storage.updateExpense(id, updates);
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: "Invalid update data" });
  }
});

// DELETE expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
    
    const deleted = await storage.deleteExpense(id);
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(err);
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;