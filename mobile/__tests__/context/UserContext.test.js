import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { UserProvider, useUser } from '../../src/context/UserContext';
import * as secureStorage from '../../src/services/secureStorage';

// Mock secure storage
jest.mock('../../src/services/secureStorage');

describe('UserContext Session Restoration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;

  describe('restoreSession with valid token', () => {
    it('should restore session when valid token exists', async () => {
      const mockToken = 'valid-jwt-token';
      const mockUser = {
        student_id: 'S123',
        name: 'Test Student',
        email: 'student@test.com',
      };
      const mockRole = 'student';

      secureStorage.getToken.mockResolvedValue(mockToken);
      secureStorage.getUserData.mockResolvedValue({
        user: mockUser,
        role: mockRole,
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
          role: mockRole,
        }),
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.userRole).toBe(mockRole);
      expect(result.current.userData).toEqual(mockUser);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/auth/verify',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should set loading state during session restoration', async () => {
      secureStorage.getToken.mockResolvedValue('token');
      secureStorage.getUserData.mockResolvedValue({ user: {}, role: 'student' });
      
      global.fetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, user: {}, role: 'student' }),
        }), 50))
      );

      const { result } = renderHook(() => useUser(), { wrapper });

      let restorePromise;
      act(() => {
        restorePromise = result.current.restoreSession();
      });

      // Check loading state is true during restoration
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await act(async () => {
        await restorePromise;
      });

      // Check loading state is false after restoration
      expect(result.current.loading).toBe(false);
    });
  });

  describe('restoreSession with expired token', () => {
    it('should clear storage and return false when token is expired', async () => {
      const expiredToken = 'expired-jwt-token';

      secureStorage.getToken.mockResolvedValue(expiredToken);
      secureStorage.clearAll.mockResolvedValue();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Token expired',
        }),
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });

    it('should handle invalid token response', async () => {
      const invalidToken = 'invalid-jwt-token';

      secureStorage.getToken.mockResolvedValue(invalidToken);
      secureStorage.clearAll.mockResolvedValue();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Invalid token',
        }),
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe('restoreSession with no token', () => {
    it('should return false when no token exists in storage', async () => {
      secureStorage.getToken.mockResolvedValue(null);

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should not call clearAll when no token exists', async () => {
      secureStorage.getToken.mockResolvedValue(null);
      secureStorage.clearAll.mockResolvedValue();

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await result.current.restoreSession();
      });

      expect(secureStorage.clearAll).not.toHaveBeenCalled();
    });
  });

  describe('restoreSession error handling', () => {
    it('should handle network errors during verification', async () => {
      secureStorage.getToken.mockResolvedValue('token');
      secureStorage.clearAll.mockResolvedValue();

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });

    it('should handle storage errors gracefully', async () => {
      secureStorage.getToken.mockRejectedValue(new Error('Storage error'));
      secureStorage.clearAll.mockResolvedValue();

      const { result } = renderHook(() => useUser(), { wrapper });

      let sessionRestored;
      await act(async () => {
        sessionRestored = await result.current.restoreSession();
      });

      expect(sessionRestored).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login and logout integration', () => {
    it('should store token and update state on login', async () => {
      const mockUser = { id: '123', name: 'Test User' };
      const mockToken = 'new-jwt-token';
      const mockRole = 'faculty';

      secureStorage.storeToken.mockResolvedValue();
      secureStorage.storeUserData.mockResolvedValue();

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await result.current.login(mockRole, mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.userRole).toBe(mockRole);
      expect(result.current.userData).toEqual(mockUser);
      expect(secureStorage.storeToken).toHaveBeenCalledWith(mockToken);
      expect(secureStorage.storeUserData).toHaveBeenCalledWith(mockUser, mockRole);
    });

    it('should clear all data on logout', async () => {
      const mockUser = { id: '123', name: 'Test User' };
      const mockToken = 'jwt-token';

      secureStorage.storeToken.mockResolvedValue();
      secureStorage.storeUserData.mockResolvedValue();
      secureStorage.clearAll.mockResolvedValue();

      const { result } = renderHook(() => useUser(), { wrapper });

      // First login
      await act(async () => {
        await result.current.login('student', mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
      expect(result.current.userRole).toBeNull();
      expect(result.current.userData).toBeNull();
      expect(secureStorage.clearAll).toHaveBeenCalled();
    });
  });
});
