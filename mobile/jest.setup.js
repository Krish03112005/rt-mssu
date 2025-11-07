// Jest setup file

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Silence console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
};
