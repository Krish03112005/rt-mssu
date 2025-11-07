# Implementation Plan

- [x] 1. Set up backend dependencies and environment configuration
  - Install bcrypt and jsonwebtoken packages in backend
  - Add JWT_SECRET and JWT_EXPIRATION to .env file
  - _Requirements: 1.1, 3.2_

- [x] 2. Implement password hashing service
  - Create backend/services/passwordService.js with hashPassword and verifyPassword functions
  - Use bcrypt with salt rounds of 10
  - _Requirements: 1.1, 1.2_

- [x] 3. Implement JWT service
  - Create backend/services/jwtService.js with generateToken and verifyToken functions
  - Configure token expiration to 7 days
  - Include userId, role, and email in JWT payload
  - _Requirements: 3.2, 5.2_

- [x] 4. Create authentication middleware
  - Create backend/middleware/authMiddleware.js
  - Extract and verify JWT from Authorization header
  - Attach decoded user data to req.user
  - Return 401 for invalid/missing tokens
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. Update registration endpoints to use password hashing
  - [x] 5.1 Update POST /api/auth/register/student endpoint
    - Import and use passwordService.hashPassword before inserting into database
    - Maintain existing validation and error handling
    - _Requirements: 1.1, 2.1, 2.4, 2.5_
  
  - [x] 5.2 Update POST /api/auth/register/faculty endpoint
    - Import and use passwordService.hashPassword before inserting into database
    - Maintain existing validation and error handling
    - _Requirements: 1.1, 2.2, 2.4, 2.5_
  
  - [x] 5.3 Update POST /api/auth/register/parent endpoint
    - Import and use passwordService.hashPassword before inserting into database
    - Add validation for student_id foreign key if provided
    - Maintain existing validation and error handling
    - _Requirements: 1.1, 2.3, 2.4, 2.5, 6.1, 6.4_

- [x] 6. Update login endpoint to use bcrypt verification and JWT generation
  - Replace plain text password comparison with passwordService.verifyPassword
  - Generate JWT token using jwtService.generateToken on successful authentication
  - Return token along with user data and role in response
  - Update error responses to match requirements
  - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4, 3.5, 7.3_

- [x] 7. Implement token verification endpoint
  - Create GET /api/auth/verify endpoint
  - Use authMiddleware to validate token
  - Return user data and role from decoded token
  - Handle token expiration and invalid token errors
  - _Requirements: 4.2, 4.3, 4.4, 5.3, 5.4_

- [x] 8. Implement logout endpoint
  - Create POST /api/auth/logout endpoint
  - Return success response (client-side token removal)
  - _Requirements: 4.5_

- [x] 9. Add enhanced error logging to authentication routes
  - Add structured error logging for authentication failures
  - Log failed login attempts with userId and role
  - Ensure passwords and full tokens are never logged
  - Log database errors with appropriate details
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 10. Set up mobile app dependencies
  - Install expo-secure-store package in mobile app
  - _Requirements: 4.1_

- [x] 11. Implement secure storage service in mobile app
  - Create mobile/src/services/secureStorage.js
  - Implement storeToken, getToken, removeToken functions
  - Implement storeUserData, getUserData functions
  - Implement clearAll function for logout
  - _Requirements: 4.1, 4.5_

- [x] 12. Enhance UserContext with authentication state management
  - Add isAuthenticated, token, and loading state variables
  - Update login function to accept and store JWT token
  - Implement logout function to clear state and call secureStorage.clearAll
  - Implement restoreSession function to load token and verify with backend
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 13. Update LoginScreen to handle JWT tokens
  - Update handleLogin to receive and store JWT token from API response
  - Add loading state with ActivityIndicator during authentication
  - Implement error handling for network failures and authentication errors
  - Display user-friendly error messages using Alert
  - _Requirements: 3.3, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 14. Implement session persistence on app launch
  - Update App.js or create AuthNavigator to check for stored token on mount
  - Call UserContext.restoreSession function
  - Navigate to Dashboard if valid token exists
  - Navigate to ProfileSelection if no valid token
  - Handle loading state during session restoration
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 15. Implement logout functionality in mobile app
  - Add logout button/option in DashboardScreen or DrawerNavigator
  - Call UserContext.logout function
  - Navigate to ProfileSelection screen after logout
  - _Requirements: 4.5_

- [x] 16. Update parent login to include linked student information
  - Modify login endpoint to fetch and include linked student data for parent role
  - Update parent login response to include student information if student_id exists
  - _Requirements: 6.2, 6.3_

- [x] 17. Write backend tests for authentication system
  - [x] 17.1 Write unit tests for password hashing service
    - Test hashPassword generates valid bcrypt hash
    - Test verifyPassword correctly validates passwords
    - _Requirements: 1.1, 1.2_
  
  - [x] 17.2 Write unit tests for JWT service
    - Test generateToken creates valid JWT with correct payload
    - Test verifyToken validates and decodes tokens correctly
    - Test verifyToken rejects expired tokens
    - _Requirements: 3.2, 5.4_
  
  - [x] 17.3 Write integration tests for registration endpoints
    - Test successful registration for all three roles
    - Test duplicate user ID and email handling
    - Test validation error responses
    - Verify passwords are hashed in database
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 17.4 Write integration tests for login endpoint
    - Test successful login for all three roles
    - Test invalid credentials handling
    - Test missing fields validation
    - Verify JWT token is returned
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 17.5 Write integration tests for protected endpoints
    - Test access with valid JWT token
    - Test rejection with invalid token
    - Test rejection with missing token
    - Test rejection with expired token
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 18. Write mobile app tests for authentication
  - [x] 18.1 Write unit tests for secure storage service
    - Test token storage and retrieval
    - Test data clearing on logout
    - _Requirements: 4.1, 4.5_
  
  - [x] 18.2 Write integration tests for login flow
    - Test successful login with token storage
    - Test error handling and display
    - Test loading states
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 18.3 Write integration tests for session restoration
    - Test app launch with valid token
    - Test app launch with expired token
    - Test app launch with no token
    - _Requirements: 4.2, 4.3, 4.4_
