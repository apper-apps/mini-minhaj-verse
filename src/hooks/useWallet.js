import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useWallet = () => {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = () => {
    const savedTransactions = JSON.parse(localStorage.getItem("minhaj-transactions") || "[]");
    const userTransactions = savedTransactions.filter(t => t.userId === user?.id);
    setTransactions(userTransactions);
  };

  const addTransaction = (amount, type, description) => {
    if (!user) return;

    const transaction = {
      id: Date.now().toString(),
      userId: user.id,
      amount: Math.abs(amount),
      type,
      description,
      timestamp: new Date().toISOString()
    };

    const newBalance = type === "credit" 
      ? user.walletBalance + Math.abs(amount)
      : user.walletBalance - Math.abs(amount);

    updateUser({ walletBalance: Math.max(0, newBalance) });

    const allTransactions = JSON.parse(localStorage.getItem("minhaj-transactions") || "[]");
    allTransactions.push(transaction);
    localStorage.setItem("minhaj-transactions", JSON.stringify(allTransactions));
    
    setTransactions(prev => [transaction, ...prev]);
  };

  return {
    balance: user?.walletBalance || 0,
    transactions,
    loading,
    addTransaction,
    loadTransactions
  };
};