#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5001"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Authentication System Test Script${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Test 1: Student Registration
echo -e "${YELLOW}[1/6] Testing Student Registration...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register/student \
  -H "Content-Type: application/json" \
  -d '{
    "student_id":"S12345",
    "name":"John Doe",
    "email":"john.doe@student.com",
    "password":"password123",
    "phone":"1234567890",
    "department":"Computer Science",
    "semester":5
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Student Registration Successful${NC}"
else
  echo -e "${RED}✗ Student Registration Failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 2: Student Login
echo -e "${YELLOW}[2/6] Testing Student Login...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"S12345",
    "password":"password123",
    "role":"student"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Student Login Successful${NC}"
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo -e "Token: ${TOKEN:0:50}..."
else
  echo -e "${RED}✗ Student Login Failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 3: Token Verification
echo -e "${YELLOW}[3/6] Testing Token Verification...${NC}"
if [ ! -z "$TOKEN" ]; then
  RESPONSE=$(curl -s -X GET $BASE_URL/api/auth/verify \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Token Verification Successful${NC}"
  else
    echo -e "${RED}✗ Token Verification Failed${NC}"
    echo "$RESPONSE"
  fi
else
  echo -e "${RED}✗ No token available to verify${NC}"
fi
echo ""

# Test 4: Faculty Registration
echo -e "${YELLOW}[4/6] Testing Faculty Registration...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register/faculty \
  -H "Content-Type: application/json" \
  -d '{
    "faculty_id":"F12345",
    "name":"Dr. Jane Smith",
    "email":"jane.smith@faculty.com",
    "password":"password123",
    "phone":"9876543210",
    "department":"Computer Science",
    "designation":"Professor"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Faculty Registration Successful${NC}"
else
  echo -e "${RED}✗ Faculty Registration Failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 5: Faculty Login
echo -e "${YELLOW}[5/6] Testing Faculty Login...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"F12345",
    "password":"password123",
    "role":"faculty"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Faculty Login Successful${NC}"
else
  echo -e "${RED}✗ Faculty Login Failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 6: Parent Registration
echo -e "${YELLOW}[6/6] Testing Parent Registration...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register/parent \
  -H "Content-Type: application/json" \
  -d '{
    "parent_id":"P12345",
    "name":"Robert Doe",
    "email":"robert.doe@parent.com",
    "password":"password123",
    "phone":"5551234567",
    "student_id":"S12345",
    "relationship":"Father"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Parent Registration Successful${NC}"
else
  echo -e "${RED}✗ Parent Registration Failed${NC}"
  echo "$RESPONSE"
fi
echo ""

# Test 7: Invalid Login
echo -e "${YELLOW}[BONUS] Testing Invalid Login (should fail)...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"S12345",
    "password":"wrongpassword",
    "role":"student"
  }')

if echo "$RESPONSE" | grep -q '"success":false'; then
  echo -e "${GREEN}✓ Invalid Login Correctly Rejected${NC}"
else
  echo -e "${RED}✗ Invalid Login Not Rejected (Security Issue!)${NC}"
  echo "$RESPONSE"
fi
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Complete!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Check that backend server is running: ${GREEN}npm run dev${NC}"
echo -e "2. Start mobile app: ${GREEN}cd mobile && npm start${NC}"
echo -e "3. Test login in mobile app with:"
echo -e "   - Student ID: ${GREEN}S12345${NC}"
echo -e "   - Password: ${GREEN}password123${NC}"
echo ""
