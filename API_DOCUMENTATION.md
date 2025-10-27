# MERN Authentication API Documentation

## Overview
This is a comprehensive REST API for user authentication built with Node.js, Express, MongoDB, and JWT tokens. It includes email verification via OTP, login/logout functionality, and protected routes.

## Base URL
```
http://localhost:YOUR_PORT
```

---

## Authentication Flow

1. **Signup** → Receive OTP via email
2. **Verify OTP** → Account activated & JWT token issued
3. **Login** → JWT token issued
4. **Access Protected Routes** → Token validated
5. **Logout** → Token cleared

---

## API Endpoints

### 1. User Signup

**Endpoint:** `POST /signup`

**Description:** Creates a new user account and sends an OTP verification email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for OTP verification.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Responses:**

- **User Already Exists:**
```json
{
  "message": "User already exists"
}
```

- **Email Send Failure (500):**
```json
{
  "success": false,
  "error": "Failed to send verification email. Please try again."
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/signup`
3. Headers: `Content-Type: application/json`
4. Body → Raw → JSON

---

### 2. Verify OTP

**Endpoint:** `POST /verify-otp`

**Description:** Verifies the OTP sent to user's email and activates the account. Issues JWT token upon success.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (201):**
```json
{
  "message": "User signed in successfully",
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "isVerified": true
  }
}
```

**Cookie Set:** `token` (JWT)

**Error Responses:**

- **Missing Fields (400):**
```json
{
  "success": false,
  "error": "Please provide email and OTP"
}
```

- **User Not Found (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

- **Already Verified (400):**
```json
{
  "success": false,
  "error": "Email already verified. Please login."
}
```

- **OTP Expired (400):**
```json
{
  "success": false,
  "error": "OTP has expired. Please request a new one.",
  "expired": true
}
```

- **Invalid OTP (400):**
```json
{
  "success": false,
  "error": "Invalid OTP. Please try again."
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/verify-otp`
3. Headers: `Content-Type: application/json`
4. Body → Raw → JSON
5. **Important:** After success, check Cookies tab to see the JWT token

---

### 3. Resend OTP

**Endpoint:** `POST /resend-otp`

**Description:** Generates and sends a new OTP to the user's email (valid for 10 minutes).

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP resent successfully! Please check your email."
}
```

**Error Responses:**

- **Missing Email (400):**
```json
{
  "success": false,
  "error": "Please provide email"
}
```

- **User Not Found (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

- **Already Verified (400):**
```json
{
  "success": false,
  "error": "Email already verified. Please login."
}
```

- **Email Send Failure (500):**
```json
{
  "success": false,
  "error": "Failed to send OTP email. Please try again."
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/resend-otp`
3. Headers: `Content-Type: application/json`
4. Body → Raw → JSON

---

### 4. Login

**Endpoint:** `POST /login`

**Description:** Authenticates user and issues JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User logged in successfully",
  "success": true
}
```

**Cookie Set:** `token` (JWT)

**Error Responses:**

- **Missing Fields:**
```json
{
  "message": "All fields are required"
}
```

- **Invalid Credentials:**
```json
{
  "message": "Incorrect password or email"
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/login`
3. Headers: `Content-Type: application/json`
4. Body → Raw → JSON
5. **Important:** Cookie will be set automatically. Check Cookies tab.

---

### 5. Logout

**Endpoint:** `POST /logout`

**Description:** Clears the JWT token cookie, effectively logging out the user.

**Request Body:** None

**Success Response (200):**
```json
{
  "message": "User logged out successfully",
  "success": true
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Server error. Please try again later."
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/logout`
3. No body required
4. Cookie will be cleared after this request

---

### 6. User Verification (Check Auth Status)

**Endpoint:** `POST /`

**Description:** Checks if the current user is authenticated by validating the JWT token.

**Request Body:** None

**Headers:** Cookie with token (automatically sent by browser/Postman)

**Success Response:**
```json
{
  "status": true,
  "user": "johndoe"
}
```

**Error Response:**
```json
{
  "status": false
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:YOUR_PORT/`
3. No body required
4. Ensure cookie from login/verify-otp is present

---

### 7. Protected Route (Example)

**Endpoint:** `GET /protected`

**Description:** Example of a protected route that requires authentication. Returns user information if authenticated.

**Authentication Required:** Yes (JWT token in cookie)

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Access granted to protected route",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- **No Token (401):**
```json
{
  "success": false,
  "message": "Authentication required. Please login."
}
```

- **Invalid/Expired Token (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

- **User Not Found (401):**
```json
{
  "success": false,
  "message": "User not found. Please login again."
}
```

**Postman Setup:**
1. Method: `GET`
2. URL: `http://localhost:YOUR_PORT/protected`
3. **Important:** Must have valid JWT token cookie from login
4. No body required

---

## Complete Testing Workflow in Postman

### Setup: Enable Cookie Management

1. Go to Postman Settings (gear icon)
2. Enable "Automatically follow redirects"
3. Enable "Enable cookie jar" or "Send cookies"
4. This ensures cookies are automatically saved and sent

### Test Flow 1: Complete Registration & Login

**Step 1: Signup**
```
POST /signup
Body:
{
  "email": "test@example.com",
  "password": "Test123!",
  "username": "testuser"
}
```
✓ Check email for OTP

**Step 2: Verify OTP**
```
POST /verify-otp
Body:
{
  "email": "test@example.com",
  "otp": "YOUR_OTP_FROM_EMAIL"
}
```
✓ Check Cookies tab - should see `token` cookie
✓ Save this token for manual testing if needed

**Step 3: Test Protected Route**
```
GET /protected
```
✓ Should return user info with status 200

**Step 4: Logout**
```
POST /logout
```
✓ Check Cookies tab - `token` should be cleared

**Step 5: Test Protected Route Again**
```
GET /protected
```
✓ Should return 401 error (not authenticated)

### Test Flow 2: OTP Resend

**Step 1: Signup**
```
POST /signup
Body:
{
  "email": "test2@example.com",
  "password": "Test123!",
  "username": "testuser2"
}
```

**Step 2: Resend OTP**
```
POST /resend-otp
Body:
{
  "email": "test2@example.com"
}
```
✓ Check email for new OTP

**Step 3: Verify with New OTP**
```
POST /verify-otp
Body:
{
  "email": "test2@example.com",
  "otp": "NEW_OTP_FROM_EMAIL"
}
```

### Test Flow 3: Login with Existing User

**Step 1: Login**
```
POST /login
Body:
{
  "email": "test@example.com",
  "password": "Test123!"
}
```
✓ Check Cookies tab - should see `token` cookie

**Step 2: Check Auth Status**
```
POST /
```
✓ Should return `{ "status": true, "user": "testuser" }`

**Step 3: Access Protected Route**
```
GET /protected
```
✓ Should return user info with status 200

**Step 4: Logout**
```
POST /logout
```

### Test Flow 4: Error Handling

**Test 1: Invalid Login**
```
POST /login
Body:
{
  "email": "test@example.com",
  "password": "WrongPassword"
}
```
✓ Should return "Incorrect password or email"

**Test 2: Invalid OTP**
```
POST /verify-otp
Body:
{
  "email": "test@example.com",
  "otp": "000000"
}
```
✓ Should return "Invalid OTP"

**Test 3: Access Protected Without Token**
```
GET /protected
```
(Clear cookies first or use Incognito request)
✓ Should return 401 error

**Test 4: Duplicate Signup**
```
POST /signup
Body:
{
  "email": "test@example.com",
  "password": "Test123!",
  "username": "testuser"
}
```
✓ Should return "User already exists"

---

## Manual Cookie Management (Alternative Method)

If automatic cookie management doesn't work:

### Step 1: Get Token from Login Response
After login/verify-otp, copy the token from the Cookies tab

### Step 2: Add to Headers Manually
For protected routes, add this header:
```
Key: Cookie
Value: token=YOUR_JWT_TOKEN_HERE
```

### Example:
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Environment Variables Setup

Create a `.env` file in the backend directory:

```env
PORT=4000
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_secret_key_for_jwt
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

## Postman Collection Structure

Organize your requests in folders:

```
MERN Auth API
├── Authentication
│   ├── Signup
│   ├── Verify OTP
│   ├── Resend OTP
│   ├── Login
│   └── Logout
├── User
│   ├── Check Auth Status
│   └── Protected Route
└── Error Cases
    ├── Invalid Login
    ├── Invalid OTP
    ├── Access Without Token
    └── Duplicate Signup
```

---

## Tips for Testing

1. **Use Postman Environment Variables:**
   - Create variable `baseUrl` = `http://localhost:4000`
   - Create variable `token` to store JWT manually
   - Use `{{baseUrl}}/signup` in requests

2. **Save Responses:**
   - Use Tests tab to automatically save token:
   ```javascript
   pm.environment.set("token", pm.cookies.get("token"));
   ```

3. **Pre-request Scripts:**
   - Clear cookies before certain tests:
   ```javascript
   pm.cookies.clear();
   ```

4. **Check Response Times:**
   - Email sending might take 1-3 seconds
   - Database operations should be < 500ms

5. **Monitor Console:**
   - Check Postman Console (View → Show Postman Console)
   - View request/response details and cookies

---

## Common Issues & Solutions

### Issue 1: Cookies Not Persisting
**Solution:** Enable cookie jar in Postman settings or manually add Cookie header

### Issue 2: CORS Errors
**Solution:** Ensure CORS is enabled in your Express app:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 3: Token Not Found in Protected Routes
**Solution:**
- Check if login was successful
- Verify cookie is present in Cookies tab
- Try manual Cookie header method

### Issue 4: OTP Not Received
**Solution:**
- Check spam/junk folder
- Verify email credentials in `.env`
- Check server logs for email errors

---

## Security Notes

1. **Password Security:** Passwords are hashed using bcrypt (12 rounds)
2. **OTP Expiration:** OTPs expire after 10 minutes
3. **JWT Token:** Stored in httpOnly cookie (set to false in current implementation - consider setting to true for production)
4. **Token Expiration:** Configure in `util/SecretToken.js`

---

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  username: String (required),
  otp: String (temporary),
  otpExpires: Date (temporary),
  isVerified: Boolean (default: false),
  createdAt: Date
}
```

---

## Middleware

### `requireAuth`
- Validates JWT token from cookies
- Attaches user object to `req.user`
- Returns 401 if token is invalid/missing
- **Usage:** Apply to any route that needs authentication

### `userVerification`
- Checks if token is valid
- Returns status boolean
- Used for checking auth state without blocking

---

## Adding More Protected Routes

To create additional protected routes:

```javascript
// In AuthController.js
module.exports.YourProtectedController = async (req, res) => {
  try {
    // req.user is available (set by requireAuth middleware)
    const userId = req.user._id;
    // Your logic here
    res.json({ success: true, data: yourData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// In AuthRoute.js
router.get("/your-route", AuthMiddleware.requireAuth, AuthController.YourProtectedController);
```

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200  | Success (GET, general operations) |
| 201  | Created (successful signup/login) |
| 400  | Bad Request (validation errors, invalid input) |
| 401  | Unauthorized (missing/invalid token) |
| 404  | Not Found (user doesn't exist) |
| 500  | Server Error (database/email errors) |

---

## Contact & Support

For issues or questions, please refer to the project repository or contact the development team.

---

**Last Updated:** 2025-10-27
**API Version:** 1.0.0
