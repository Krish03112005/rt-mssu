// API Configuration
// Change this based on your testing environment

// For iOS Simulator or Android Emulator: use 'localhost'
// For Physical Device: use your computer's IP address (e.g., '192.168.0.206')

const getApiUrl = () => {
  // Automatically detect if running on device or simulator
  const isDevice = !__DEV__ || process.env.EXPO_PUBLIC_API_URL;
  
  if (process.env.EXPO_PUBLIC_API_URL) {
    // Use environment variable if set
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Default to localhost for development
  // Change this to your computer's IP when testing on physical device
  return 'http://localhost:5001';
  
  // Uncomment this line when testing on physical device:
  // return 'http://192.168.0.206:5001';
};

export const API_URL = getApiUrl();

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  VERIFY: `${API_URL}/api/auth/verify`,
  LOGOUT: `${API_URL}/api/auth/logout`,
  REGISTER_STUDENT: `${API_URL}/api/auth/register/student`,
  REGISTER_FACULTY: `${API_URL}/api/auth/register/faculty`,
  REGISTER_PARENT: `${API_URL}/api/auth/register/parent`,
};

export default API_URL;
