const transactionService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem("minhaj-transactions") || "[]");
  },

  async getByUserId(userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transactions = JSON.parse(localStorage.getItem("minhaj-transactions") || "[]");
    return transactions.filter(t => t.userId === userId);
  },

  async create(transaction) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const transactions = JSON.parse(localStorage.getItem("minhaj-transactions") || "[]");
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem("minhaj-transactions", JSON.stringify(transactions));
    return newTransaction;
  },

  async addUserTransaction(userId, amount, type, description) {
    const transaction = await this.create({
      userId,
      amount: Math.abs(amount),
      type,
      description
    });

    // Update user wallet balance
    const users = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      const currentBalance = users[userIndex].walletBalance || 0;
      const newBalance = type === "credit" 
        ? currentBalance + Math.abs(amount)
        : currentBalance - Math.abs(amount);
      
      users[userIndex].walletBalance = Math.max(0, newBalance);
      localStorage.setItem("minhaj-users", JSON.stringify(users));
    }

    return transaction;
  }
};

export default transactionService;