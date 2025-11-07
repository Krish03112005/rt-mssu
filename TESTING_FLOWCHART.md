# Authentication Testing Flow

## Visual Testing Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    START TESTING                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Start Backend Server                               │
│  Command: cd backend && npm run dev                          │
│  Expected: "Server is running on PORT: 5001"                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Create Test Users                                  │
│  Run: ./test_auth.sh                                         │
│  OR use curl commands from TESTING_GUIDE.md                 │
│                                                              │
│  Creates:                                                    │
│  • Student: S12345 / password123                            │
│  • Faculty: F12345 / password123                            │
│  • Parent:  P12345 / password123                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Verify Backend APIs                                │
│  Test:                                                       │
│  ✓ Registration endpoints                                   │
│  ✓ Login endpoints                                          │
│  ✓ Token verification                                       │
│  ✓ Error handling                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Start Mobile App                                   │
│  Command: cd mobile && npm start                             │
│  Then: Scan QR code with Expo Go app                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Test Mobile App Flow                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│ First Launch     │                  │ Subsequent Launch│
│ (No Token)       │                  │ (With Token)     │
└──────────────────┘                  └──────────────────┘
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│ Splash Screen    │                  │ Splash Screen    │
│ (2 seconds)      │                  │ (2 seconds)      │
└──────────────────┘                  └──────────────────┘
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│ Profile          │                  │ Verify Token     │
│ Selection        │                  │ with Backend     │
└──────────────────┘                  └──────────────────┘
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│ Select Role:     │                  │ Auto-Login       │
│ • Student        │                  │ Success!         │
│ • Faculty        │                  └──────────────────┘
│ • Parent         │                           ↓
└──────────────────┘                  ┌──────────────────┐
        ↓                              │ Dashboard        │
┌──────────────────┐                  └──────────────────┘
│ Login Screen     │
└──────────────────┘
        ↓
┌──────────────────┐
│ Enter:           │
│ • User ID        │
│ • Password       │
└──────────────────┘
        ↓
┌──────────────────┐
│ Tap Login        │
└──────────────────┘
        ↓
    ┌───┴───┐
    │ Valid?│
    └───┬───┘
        │
    ┌───┴────────────────┐
    ↓                    ↓
┌────────┐          ┌────────┐
│  YES   │          │   NO   │
└────────┘          └────────┘
    ↓                    ↓
┌──────────────┐   ┌──────────────┐
│ Store Token  │   │ Show Error   │
│ in Secure    │   │ Alert        │
│ Storage      │   └──────────────┘
└──────────────┘          ↓
    ↓              ┌──────────────┐
┌──────────────┐   │ Stay on      │
│ Navigate to  │   │ Login Screen │
│ Dashboard    │   └──────────────┘
└──────────────┘
```

## Mobile App Testing Scenarios

### Scenario 1: Successful Login Flow
```
Profile Selection → Select Student → Login Screen
                                          ↓
                    Enter: S12345 / password123
                                          ↓
                         Tap Login Button
                                          ↓
                      Loading Indicator Shows
                                          ↓
                    Backend Validates Credentials
                                          ↓
                      Returns JWT Token
                                          ↓
                   Token Stored in Secure Storage
                                          ↓
                    Navigate to Dashboard
                                          ↓
                         SUCCESS! ✓
```

### Scenario 2: Invalid Credentials
```
Login Screen → Enter: S12345 / wrongpassword
                                ↓
                      Tap Login Button
                                ↓
                  Backend Rejects Credentials
                                ↓
              Alert: "Login Failed: Invalid credentials"
                                ↓
                    Stay on Login Screen
                                ↓
                      User Can Retry
```

### Scenario 3: Session Restoration
```
App Launch → Splash Screen → Check Secure Storage
                                      ↓
                              Token Found?
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
                  YES                                  NO
                    ↓                                   ↓
          Verify with Backend                Profile Selection
                    ↓
            ┌───────┴───────┐
            ↓               ↓
          Valid          Invalid
            ↓               ↓
        Dashboard      Clear Storage
                            ↓
                    Profile Selection
```

## Quick Test Checklist

### Backend Tests (5 minutes)
```bash
# Terminal 1: Start server
cd backend
npm run dev

# Terminal 2: Run test script
./test_auth.sh

# Expected: All tests pass ✓
```

### Mobile Tests (10 minutes)
```bash
# Terminal 3: Start mobile app
cd mobile
npm start

# On your phone:
1. Open Expo Go
2. Scan QR code
3. Test login with: S12345 / password123
4. Verify dashboard loads
5. Close app and reopen (test session restoration)
```

### Automated Tests (2 minutes)
```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test

# Expected: All 33+ tests pass ✓
```

## Common Test Results

### ✅ Success Indicators
- Backend: `"success": true` in API responses
- Mobile: Navigation to Dashboard after login
- Token: JWT token returned and stored
- Session: Auto-login on app relaunch

### ❌ Failure Indicators
- Backend: `"success": false` with error message
- Mobile: Alert dialogs with error messages
- Network: "Connection Error" alerts
- Validation: "Please enter both User ID and Password"

## Testing Timeline

```
Total Time: ~20 minutes

├─ Backend Setup (2 min)
│  └─ Start server, verify connection
│
├─ User Creation (3 min)
│  └─ Register 3 test users
│
├─ API Testing (5 min)
│  └─ Test all endpoints
│
├─ Mobile Setup (2 min)
│  └─ Start Expo, load app
│
├─ Mobile Testing (8 min)
│  ├─ Test login flow (3 min)
│  ├─ Test error cases (2 min)
│  └─ Test session restoration (3 min)
│
└─ Verification (2 min)
   └─ Run automated tests
```

## What to Look For

### In Backend Terminal
```
✓ Server is running on PORT: 5001
✓ Database initialized successfully
✓ [AUTH INFO] Login successful: { userId: 'S12345', role: 'student' }
✓ [AUTH INFO] Student registered successfully
```

### In Mobile App
```
✓ Splash screen appears for 2 seconds
✓ Profile selection shows 3 role cards
✓ Login screen shows correct role icon and title
✓ Loading indicator during authentication
✓ Dashboard displays after successful login
✓ User name and role displayed correctly
```

### In Test Output
```
✓ All backend tests pass (XX tests)
✓ All mobile tests pass (33 tests)
✓ No console errors
✓ No network failures
```

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Backend won't start | Check DATABASE_URL in .env |
| Port 5001 in use | `lsof -ti:5001 \| xargs kill -9` |
| Mobile can't connect | Update API_URL to your IP address |
| Token not storing | Restart Expo dev server |
| Tests failing | Clear node_modules and reinstall |
| Database errors | Check Neon DB connection |

## Next Steps After Testing

Once all tests pass:
1. ✅ Authentication system is working
2. ✅ Users can register and login
3. ✅ Tokens are securely stored
4. ✅ Session restoration works
5. ✅ Ready for production deployment

Congratulations! Your authentication system is fully functional! 🎉
