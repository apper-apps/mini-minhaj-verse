import userService from './userService.js';

// Mock transaction data
const mockTransactions = [
  {
    Id: 1,
    userId: 1,
    type: 'credit',
    amount: 50.00,
    description: 'Weekly teaching bonus',
    timestamp: '2024-01-20T09:00:00Z',
    balanceAfter: 250.75
  },
  {
    Id: 2,
    userId: 2,
    type: 'credit',
    amount: 25.00,
    description: 'Quran memorization milestone reward',
    timestamp: '2024-01-19T14:30:00Z',
    balanceAfter: 125.50
  },
  {
    Id: 3,
    userId: 1,
    type: 'debit',
    amount: 15.00,
    description: 'Islamic books purchase',
    timestamp: '2024-01-18T16:45:00Z',
    balanceAfter: 200.75
  },
  {
    Id: 4,
    userId: 4,
    type: 'credit',
    amount: 75.00,
    description: 'Arabic calligraphy workshop earnings',
    timestamp: '2024-01-18T11:20:00Z',
    balanceAfter: 320.25
  },
  {
    Id: 5,
    userId: 5,
    type: 'credit',
    amount: 20.00,
    description: 'Daily learning completion bonus',
    timestamp: '2024-01-17T19:10:00Z',
    balanceAfter: 85.00
  },
  {
    Id: 6,
    userId: 2,
    type: 'debit',
    amount: 10.00,
    description: 'Prayer times app subscription',
    timestamp: '2024-01-16T12:00:00Z',
    balanceAfter: 100.50
  },
  {
    Id: 7,
    userId: 1,
    type: 'credit',
    amount: 100.00,
    description: 'Monthly teaching salary',
    timestamp: '2024-01-15T10:00:00Z',
    balanceAfter: 215.75
  }
];

// Initialize transactions in localStorage
const initializeTransactions = () => {
  const stored = localStorage.getItem('minhaj-transactions');
  if (!stored) {
    localStorage.setItem('minhaj-transactions', JSON.stringify(mockTransactions));
    return mockTransactions;
  }
  return JSON.parse(stored);
};

// Get next available ID
const getNextId = (transactions) => {
  const maxId = transactions.reduce((max, transaction) => Math.max(max, transaction.Id), 0);
  return maxId + 1;
};

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

const transactionService = {
  async getAll() {
    await delay();
    const transactions = initializeTransactions();
    // Sort by timestamp descending (newest first)
    return [...transactions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid transaction ID');
    }
    
    await delay();
    const transactions = initializeTransactions();
    const transaction = transactions.find(t => t.Id === id);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return { ...transaction };
  },

  async create(transactionData) {
    await delay();
    const transactions = initializeTransactions();
    
    // Auto-generate ID, ignore any provided Id
    const newTransaction = {
      ...transactionData,
      Id: getNextId(transactions),
      timestamp: new Date().toISOString()
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    localStorage.setItem('minhaj-transactions', JSON.stringify(updatedTransactions));
    
    return { ...newTransaction };
  },

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid transaction ID');
    }
    
    await delay();
    const transactions = initializeTransactions();
    const transactionIndex = transactions.findIndex(t => t.Id === id);
    
    if (transactionIndex === -1) {
      throw new Error('Transaction not found');
    }
    
    // Prevent ID updates
    const { Id, ...allowedUpdates } = updateData;
    
    const updatedTransaction = {
      ...transactions[transactionIndex],
      ...allowedUpdates
    };
    
    const updatedTransactions = [...transactions];
    updatedTransactions[transactionIndex] = updatedTransaction;
    localStorage.setItem('minhaj-transactions', JSON.stringify(updatedTransactions));
    
    return { ...updatedTransaction };
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid transaction ID');
    }
    
    await delay();
    const transactions = initializeTransactions();
    const transactionExists = transactions.some(t => t.Id === id);
    
    if (!transactionExists) {
      throw new Error('Transaction not found');
    }
    
    const updatedTransactions = transactions.filter(t => t.Id !== id);
    localStorage.setItem('minhaj-transactions', JSON.stringify(updatedTransactions));
    
    return { success: true };
  },

  async getByUserId(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const transactions = await this.getAll();
    return transactions.filter(t => t.userId === userId);
  },

  async addUserTransaction(userId, amount, type, description) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid transaction amount');
    }
    
    if (!['credit', 'debit'].includes(type)) {
      throw new Error('Invalid transaction type');
    }
    
    if (!description || description.trim().length === 0) {
      throw new Error('Transaction description is required');
    }
    
    try {
      // Get current user to calculate new balance
      const user = await userService.getById(userId);
      const currentBalance = user.walletBalance || 0;
      
      let newBalance;
      if (type === 'credit') {
        newBalance = currentBalance + amount;
      } else {
        newBalance = currentBalance - amount;
        if (newBalance < 0) {
          throw new Error('Insufficient wallet balance');
        }
      }
      
      // Create transaction record
      const transaction = await this.create({
        userId,
        type,
        amount,
        description: description.trim(),
        balanceAfter: newBalance
      });
      
      // Update user's wallet balance
      await userService.updateWalletBalance(userId, newBalance);
      
      return transaction;
    } catch (error) {
      throw new Error(`Failed to process transaction: ${error.message}`);
    }
  },

  async getUserBalance(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    try {
      const user = await userService.getById(userId);
      return user.walletBalance || 0;
    } catch (error) {
      throw new Error('Failed to get user balance');
    }
  },

  async getTransactionHistory(userId, limit = 10) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const userTransactions = await this.getByUserId(userId);
    return userTransactions.slice(0, limit);
  },

  async getTotalCredits(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const userTransactions = await this.getByUserId(userId);
    return userTransactions
      .filter(t => t.type === 'credit')
      .reduce((total, t) => total + t.amount, 0);
  },

  async getTotalDebits(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const userTransactions = await this.getByUserId(userId);
    return userTransactions
      .filter(t => t.type === 'debit')
      .reduce((total, t) => total + t.amount, 0);
  }
};

export default transactionService;