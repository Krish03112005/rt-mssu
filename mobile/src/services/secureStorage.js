import * as SecureStore from 'expo-secure-store';

// Storage keys
const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
};

/**
 * Store JWT token securely
 * @param {string} token - JWT token to store
 * @returns {Promise<void>}
 */
export const storeToken = async (token) => {
  try {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

/**
 * Retrieve stored JWT token
 * @returns {Promise<string|null>} - JWT token or null if not found
 */
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Remove stored JWT token
 * @returns {Promise<void>}
 */
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

/**
 * Store user data and role
 * @param {Object} user - User data object
 * @param {string} role - User role (student/faculty/parent)
 * @returns {Promise<void>}
 */
export const storeUserData = async (user, role) => {
  try {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(user));
    await SecureStore.setItemAsync(KEYS.USER_ROLE, role);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

/**
 * Retrieve stored user data and role
 * @returns {Promise<{user: Object|null, role: string|null}>}
 */
export const getUserData = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync(KEYS.USER_DATA);
    const role = await SecureStore.getItemAsync(KEYS.USER_ROLE);
    
    const user = userDataString ? JSON.parse(userDataString) : null;
    
    return { user, role };
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return { user: null, role: null };
  }
};

/**
 * Clear all stored authentication data (for logout)
 * @returns {Promise<void>}
 */
export const clearAll = async () => {
  try {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
    await SecureStore.deleteItemAsync(KEYS.USER_ROLE);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};
