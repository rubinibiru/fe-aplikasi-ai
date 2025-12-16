// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cek localStorage saat aplikasi pertama kali dibuka
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fungsi Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Fungsi Register
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.register(name, email, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);