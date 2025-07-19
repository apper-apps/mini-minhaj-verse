import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Error from "@/components/ui/Error";
import userService from "@/services/api/userService";

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
      setLoading(true);
      
      // Check if user already exists
      const existingUser = await userService.findByEmail(googleUser.email);
      
      let userData;
      if (existingUser) {
        // Update last active time
        userData = await userService.update(existingUser.id, {
          lastActive: new Date().toISOString()
        });
      } else {
        // Create new user
        userData = await userService.create({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          role: "student" // Default role
        });
      }
      
      setUser(userData);
      localStorage.setItem('minhaj-user', JSON.stringify(userData));
      toast.success("Welcome to Minhaj Verse!");
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('minhaj-user');
    toast.info("Logged out successfully");
  };

  const updateUser = (updatedData) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('minhaj-user', JSON.stringify(updatedUser));
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