import React, {createContext, useState, useContext} from 'react';
import * as secureStorage from '../services/secureStorage';
import { API_URL } from '../config/api';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [userRole, setUserRole] = useState(null); // 'student', 'faculty', 'parent'
  const [userData, setUserData] = useState(null); // Store user data after login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(false); // Loading state for async operations

  /**
   * Login function - accepts role, user data, and JWT token
   * Stores token and user data in secure storage
   */
  const login = async (role, user, jwtToken) => {
    try {
      setLoading(true);
      
      // Store token and user data in secure storage
      await secureStorage.storeToken(jwtToken);
      await secureStorage.storeUserData(user, role);
      
      // Update context state
      setUserRole(role);
      setUserData(user);
      setToken(jwtToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function - clears all authentication state and secure storage
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear secure storage
      await secureStorage.clearAll();
      
      // Clear context state
      setUserRole(null);
      setUserData(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Restore session function - loads token from storage and verifies with backend
   * Called on app launch to check for existing valid session
   */
  const restoreSession = async () => {
    try {
      setLoading(true);
      
      // Load token from secure storage
      const storedToken = await secureStorage.getToken();
      
      if (!storedToken) {
        // No token found, user needs to login
        setIsAuthenticated(false);
        return false;
      }
      
      // Verify token with backend
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Token is invalid or expired
        await secureStorage.clearAll();
        setIsAuthenticated(false);
        return false;
      }
      
      const data = await response.json();
      
      // Load user data from secure storage
      const {user, role} = await secureStorage.getUserData();
      
      // Restore session state
      setToken(storedToken);
      setUserRole(role || data.role);
      setUserData(user || data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Error restoring session:', error);
      // Clear storage on error
      await secureStorage.clearAll();
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      userRole, 
      setUserRole, 
      userData, 
      setUserData,
      isAuthenticated,
      token,
      loading,
      login,
      logout,
      restoreSession,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
