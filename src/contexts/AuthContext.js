import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, setAuthToken } from '../services/auth';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedAuthData = await AsyncStorage.getItem('@AuthData');
      if (storedAuthData) {
        const authData = JSON.parse(storedAuthData);
        setAuthToken(authData.token);
        setAuthData(authData);
      }
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response;
      
      const authData = {
        token,
        user,
      };

      await AsyncStorage.setItem('@AuthData', JSON.stringify(authData));
      setAuthData(authData);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (name, email, password) => {
    try {
      await authService.register({ name, email, password });
      await signIn(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setAuthData(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('@AuthData');
  };

  const updateUser = async ({ name, email, currentPassword, newPassword }) => {
    try {
      const userData = {
        name,
        email,
        ...(newPassword && {
          password: newPassword,
          currentPassword: currentPassword
        })
      };

      const updatedUser = await authService.update(userData);
      
      const newAuthData = {
        token: authData.token,
        user: updatedUser
      };

      await AsyncStorage.setItem('@AuthData', JSON.stringify(newAuthData));
      setAuthData(newAuthData);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.delete();
      await signOut();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authData, 
      loading,
      signIn,
      signUp,
      signOut,
      updateUser,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 