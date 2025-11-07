import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import { UserProvider } from '../../src/context/UserContext';
import * as secureStorage from '../../src/services/secureStorage';

// Mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
};

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock secure storage
jest.mock('../../src/services/secureStorage');

describe('LoginScreen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    secureStorage.storeToken.mockResolvedValue();
    secureStorage.storeUserData.mockResolvedValue();
  });

  const renderLoginScreen = (userRole = 'student') => {
    return render(
      <UserProvider>
        <TestWrapper userRole={userRole} navigation={mockNavigation} />
      </UserProvider>
    );
  };

  // Helper component to set user role
  const TestWrapper = ({ userRole, navigation }) => {
    const { setUserRole } = require('../../src/context/UserContext').useUser();
    React.useEffect(() => {
      setUserRole(userRole);
    }, [setUserRole]);
    return <LoginScreen navigation={navigation} />;
  };

  describe('Successful Login', () => {
    it('should handle successful login with token storage', async () => {
      const mockUser = {
        student_id: 'S123',
        name: 'Test Student',
        email: 'student@test.com',
      };
      const mockToken = 'mock-jwt-token';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
          token: mockToken,
          role: 'student',
        }),
      });

      const { getByPlaceholderText, getByText } = renderLoginScreen('student');

      const userIdInput = getByPlaceholderText('Student ID');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'S123');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: 'S123',
              password: 'password123',
              role: 'student',
            }),
          })
        );
      });

      await waitFor(() => {
        expect(secureStorage.storeToken).toHaveBeenCalledWith(mockToken);
        expect(secureStorage.storeUserData).toHaveBeenCalledWith(mockUser, 'student');
        expect(mockReplace).toHaveBeenCalledWith('Dashboard');
      });
    });

    it('should display loading indicator during authentication', async () => {
      global.fetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true, user: {}, token: 'token' }),
        }), 100))
      );

      const { getByPlaceholderText, getByText, queryByTestId } = renderLoginScreen('student');

      const userIdInput = getByPlaceholderText('Student ID');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'S123');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      // Check that inputs are disabled during loading
      await waitFor(() => {
        expect(userIdInput.props.editable).toBe(false);
        expect(passwordInput.props.editable).toBe(false);
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });

  describe('Error Handling', () => {
    it('should display error alert for invalid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Invalid credentials',
        }),
      });

      const { getByPlaceholderText, getByText } = renderLoginScreen('student');

      const userIdInput = getByPlaceholderText('Student ID');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'S123');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Login Failed', 'Invalid credentials');
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should display connection error for network failures', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { getByPlaceholderText, getByText } = renderLoginScreen('student');

      const userIdInput = getByPlaceholderText('Student ID');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'S123');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Connection Error',
          'Unable to connect to server. Please check your connection.'
        );
      });

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should show error when fields are empty', async () => {
      const { getByText } = renderLoginScreen('student');

      const loginButton = getByText('Login');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both User ID and Password');
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should show error when only userId is provided', async () => {
      const { getByPlaceholderText, getByText } = renderLoginScreen('student');

      const userIdInput = getByPlaceholderText('Student ID');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'S123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both User ID and Password');
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Role-Specific Behavior', () => {
    it('should use correct placeholder for faculty role', () => {
      const { getByPlaceholderText } = renderLoginScreen('faculty');
      expect(getByPlaceholderText('Faculty ID')).toBeTruthy();
    });

    it('should use correct placeholder for parent role', () => {
      const { getByPlaceholderText } = renderLoginScreen('parent');
      expect(getByPlaceholderText('Parent ID')).toBeTruthy();
    });

    it('should send correct role in login request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: {},
          token: 'token',
        }),
      });

      const { getByPlaceholderText, getByText } = renderLoginScreen('faculty');

      const userIdInput = getByPlaceholderText('Faculty ID');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(userIdInput, 'F123');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:5001/api/auth/login',
          expect.objectContaining({
            body: JSON.stringify({
              userId: 'F123',
              password: 'password123',
              role: 'faculty',
            }),
          })
        );
      });
    });
  });
});
