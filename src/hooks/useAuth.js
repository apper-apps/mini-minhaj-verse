import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("minhaj-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (googleUser) => {
    try {
      // Simulate Google Sign-In response
      const userData = {
        id: googleUser.id || Date.now().toString(),
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        role: "student", // Default role
        isApproved: false, // Requires admin approval
        walletBalance: 0,
        joinedAt: new Date().toISOString()
      };

      // Check if user already exists in approved users
      const existingUsers = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
      const existingUser = existingUsers.find(u => u.email === userData.email);
      
      if (existingUser) {
        if (existingUser.isApproved) {
          setUser(existingUser);
          localStorage.setItem("minhaj-user", JSON.stringify(existingUser));
          toast.success("Welcome back!");
          return existingUser;
        } else {
          setUser(existingUser);
          localStorage.setItem("minhaj-user", JSON.stringify(existingUser));
          toast.info("Your account is pending approval");
          return existingUser;
        }
      }

      // Add new user to pending list
      existingUsers.push(userData);
      localStorage.setItem("minhaj-users", JSON.stringify(existingUsers));
      
      setUser(userData);
      localStorage.setItem("minhaj-user", JSON.stringify(userData));
      toast.info("Account created! Awaiting admin approval.");
      
      return userData;
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("minhaj-user");
    toast.success("Logged out successfully");
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("minhaj-user", JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex >= 0) {
      users[userIndex] = updatedUser;
      localStorage.setItem("minhaj-users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};