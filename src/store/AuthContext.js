import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data when the app loads
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        console.log('User logged in and data stored:', userData);
      } catch (error) {
        console.error('Error storing user data:', error);
      }
  };

  const logout = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        setUser(null);
        console.log('User logged out and data removed');
      } catch (error) {
        console.error('Error removing user data:', error);
      }
  };

  const skipLogin = () => {
    setUser({ isSkipped: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, skipLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);