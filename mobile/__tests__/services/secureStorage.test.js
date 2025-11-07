import * as SecureStore from 'expo-secure-store';
import * as secureStorage from '../../src/services/secureStorage';

describe('Secure Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeToken', () => {
    it('should store token successfully', async () => {
      const token = 'test-jwt-token';
      SecureStore.setItemAsync.mockResolvedValue();

      await secureStorage.storeToken(token);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', token);
    });

    it('should throw error when storage fails', async () => {
      const error = new Error('Storage failed');
      SecureStore.setItemAsync.mockRejectedValue(error);

      await expect(secureStorage.storeToken('token')).rejects.toThrow('Storage failed');
    });
  });

  describe('getToken', () => {
    it('should retrieve stored token', async () => {
      const token = 'stored-jwt-token';
      SecureStore.getItemAsync.mockResolvedValue(token);

      const result = await secureStorage.getToken();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(token);
    });

    it('should return null when no token exists', async () => {
      SecureStore.getItemAsync.mockResolvedValue(null);

      const result = await secureStorage.getToken();

      expect(result).toBeNull();
    });

    it('should return null when retrieval fails', async () => {
      SecureStore.getItemAsync.mockRejectedValue(new Error('Retrieval failed'));

      const result = await secureStorage.getToken();

      expect(result).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('should remove token successfully', async () => {
      SecureStore.deleteItemAsync.mockResolvedValue();

      await secureStorage.removeToken();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
    });

    it('should throw error when removal fails', async () => {
      const error = new Error('Removal failed');
      SecureStore.deleteItemAsync.mockRejectedValue(error);

      await expect(secureStorage.removeToken()).rejects.toThrow('Removal failed');
    });
  });

  describe('storeUserData', () => {
    it('should store user data and role successfully', async () => {
      const user = { id: '123', name: 'Test User', email: 'test@example.com' };
      const role = 'student';
      SecureStore.setItemAsync.mockResolvedValue();

      await secureStorage.storeUserData(user, role);

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_data', JSON.stringify(user));
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_role', role);
    });

    it('should throw error when storage fails', async () => {
      const error = new Error('Storage failed');
      SecureStore.setItemAsync.mockRejectedValue(error);

      await expect(secureStorage.storeUserData({}, 'student')).rejects.toThrow('Storage failed');
    });
  });

  describe('getUserData', () => {
    it('should retrieve stored user data and role', async () => {
      const user = { id: '123', name: 'Test User' };
      const role = 'faculty';
      SecureStore.getItemAsync
        .mockResolvedValueOnce(JSON.stringify(user))
        .mockResolvedValueOnce(role);

      const result = await secureStorage.getUserData();

      expect(result).toEqual({ user, role });
    });

    it('should return null values when no data exists', async () => {
      SecureStore.getItemAsync.mockResolvedValue(null);

      const result = await secureStorage.getUserData();

      expect(result).toEqual({ user: null, role: null });
    });

    it('should return null values when retrieval fails', async () => {
      SecureStore.getItemAsync.mockRejectedValue(new Error('Retrieval failed'));

      const result = await secureStorage.getUserData();

      expect(result).toEqual({ user: null, role: null });
    });
  });

  describe('clearAll', () => {
    it('should clear all stored authentication data', async () => {
      SecureStore.deleteItemAsync.mockResolvedValue();

      await secureStorage.clearAll();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_data');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_role');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(3);
    });

    it('should throw error when clearing fails', async () => {
      const error = new Error('Clear failed');
      SecureStore.deleteItemAsync.mockRejectedValue(error);

      await expect(secureStorage.clearAll()).rejects.toThrow('Clear failed');
    });
  });
});
