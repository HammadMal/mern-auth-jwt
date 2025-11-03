# MERN Authentication API Documentation

## Overview

This is a comprehensive REST API for user authentication built with Node.js, Express, MongoDB, and JWT tokens. It includes email verification via OTP, login/logout functionality, and protected routes.

## Base URL

```sh
http://localhost:YOUR_PORT

```

---

## Authentication Flow

### Standard Authentication (Email/Password)
1. **Signup** → Receive OTP via email
2. **Verify OTP** → Account activated & JWT token issued
3. **Login** → JWT token issued
4. **Access Protected Routes** → Token validated
5. **Logout** → Token cleared

### Google OAuth Authentication
1. **Initiate Google Login** → Redirect to Google
2. **Google Authentication** → User signs in with Google
3. **Callback** → JWT token issued & user created/linked
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

- **Missing Required Fields (400):**

```json
{
  "success": false,
  "error": "Email, password, and username are required"
}

```

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

- **OAuth User Attempting Password Login (400):**

```json
{
  "success": false,
  "message": "This account uses Google Sign-In. Please use Google to login."
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

### 7. Google OAuth Login

**Endpoint:** `GET /auth/google`

**Description:** Initiates Google OAuth 2.0 authentication flow. This endpoint must be accessed via a **browser**, not Postman.

**Request Body:** None

**Authentication Required:** No

**Flow:**
1. User visits `http://localhost:4000/auth/google` in browser
2. Redirects to Google login page
3. User signs in with Google account
4. Google redirects back to `/auth/google/callback`
5. Server creates/links user account
6. Sets JWT token cookie
7. Redirects to frontend: `http://localhost:3000/dashboard?auth=success`

**Success:**
- JWT token cookie is set
- User is auto-verified (`isVerified: true`)
- If email exists, Google account is linked to existing user
- Redirects to: `CLIENT_URL/dashboard?auth=success`

**Error:**
- Redirects to: `CLIENT_URL/login?error=oauth_failed`

**User Types:**

**New Google User:**
```javascript
{
  googleId: "google_user_id",
  username: "Display Name from Google",
  email: "user@gmail.com",
  isVerified: true,
  password: undefined // No password for OAuth users
}
```

**Existing User (Email Match):**
- Links Google account to existing user
- Sets `googleId` field
- Sets `isVerified: true`

**Important Notes:**
- Cannot be tested in Postman (requires browser for OAuth flow)
- OAuth users don't have passwords
- OAuth users cannot login via `/login` endpoint (password login)
- If OAuth user tries password login, receives error: "This account uses Google Sign-In"

**Browser Testing:**
1. Visit: `http://localhost:4000/auth/google`
2. Sign in with Google
3. Check browser cookies (DevTools → Application → Cookies)
4. Look for `token` cookie
5. Verify redirect (will fail if frontend not running)

---

### 8. Google OAuth Callback

**Endpoint:** `GET /auth/google/callback`

**Description:** Callback endpoint for Google OAuth. Automatically called by Google after authentication. **Do not call directly.**

**Request Body:** None

**Handled Automatically By:**
- Passport.js Google OAuth Strategy
- Creates or links user account
- Issues JWT token
- Redirects to frontend

---

### 9. Protected Route (Example)

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

```sh
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

```sh
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

```sh
GET /protected

```

✓ Should return user info with status 200

**Step 4: Logout**

```sh
POST /logout

```

✓ Check Cookies tab - `token` should be cleared

**Step 5: Test Protected Route Again**

```sh
GET /protected

```

✓ Should return 401 error (not authenticated)

### Test Flow 2: OTP Resend

**Step 1: Signup**

```sh
POST /signup
Body:
{
  "email": "test2@example.com",
  "password": "Test123!",
  "username": "testuser2"
}

```

**Step 2: Resend OTP**

```sh
POST /resend-otp
Body:
{
  "email": "test2@example.com"
}

```

✓ Check email for new OTP

**Step 3: Verify with New OTP**

```sh
POST /verify-otp
Body:
{
  "email": "test2@example.com",
  "otp": "NEW_OTP_FROM_EMAIL"
}

```

### Test Flow 3: Login with Existing User

**Step 1: Login**

```sh
POST /login
Body:
{
  "email": "test@example.com",
  "password": "Test123!"
}

```

✓ Check Cookies tab - should see `token` cookie

**Step 2: Check Auth Status**

```text
POST /

```

✓ Should return `{ "status": true, "user": "testuser" }`

**Step 3: Access Protected Route**

```sh
GET /protected

```

✓ Should return user info with status 200

**Step 4: Logout**

```sh
POST /logout

```

### Test Flow 4: Error Handling

**Test 1: Invalid Login**

```sh
POST /login
Body:
{
  "email": "test@example.com",
  "password": "WrongPassword"
}

```

✓ Should return "Incorrect password or email"

**Test 2: Invalid OTP**

```sh
POST /verify-otp
Body:
{
  "email": "test@example.com",
  "otp": "000000"
}

```

✓ Should return "Invalid OTP"

**Test 3: Access Protected Without Token**

```sh
GET /protected

```

(Clear cookies first or use Incognito request)
✓ Should return 401 error

**Test 4: Duplicate Signup**

```sh
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

```yaml
Key: Cookie
Value: token=YOUR_JWT_TOKEN_HERE

```

### Example:

```yaml
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
EMAIL_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=http://localhost:3000

```

**Getting Google OAuth Credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set Authorized JavaScript origins: `http://localhost:4000`
6. Set Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

---

## Postman Collection Structure

Organize your requests in folders:

```ini
MERN Auth API
├── Authentication
│   ├── Signup
│   ├── Verify OTP
│   ├── Resend OTP
│   ├── Login
│   ├── Logout
│   └── Google OAuth (Browser Only)
├── User
│   ├── Check Auth Status
│   └── Protected Route
└── Error Cases
    ├── Invalid Login
    ├── Invalid OTP
    ├── Access Without Token
    ├── Duplicate Signup
    └── OAuth User Password Login

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
3. **JWT Token Security:**
   - Stored in httpOnly cookie (protects against XSS attacks)
   - `secure` flag enabled in production (HTTPS only)
   - `sameSite: 'lax'` (protects against CSRF)
   - 24-hour expiration
4. **Token Expiration:** Configure in `util/SecretToken.js`
5. **OAuth Security:**
   - OAuth users have no password (prevents password-based attacks)
   - Email verification automatic for OAuth users
   - Google handles authentication (delegated security)
6. **Account Protection:**
   - OAuth users cannot login via password endpoint
   - Password validation enforced for normal signup
   - Existing accounts can be linked to Google OAuth

---

## Database Schema

### User Model

```javascript
{
  email: String (required, unique),
  password: String (optional, hashed) // Required for email/password auth, undefined for OAuth users,
  username: String (required),
  otp: String (temporary),
  otpExpires: Date (temporary),
  isVerified: Boolean (default: false, true for OAuth users),
  googleId: String (optional, set for Google OAuth users),
  createdAt: Date
}

```

**User Types:**

1. **Email/Password User:**
   - Has `password` (hashed with bcrypt)
   - `googleId` is `null`
   - Requires OTP verification (`isVerified` starts as `false`)

2. **Google OAuth User:**
   - No `password` field (undefined)
   - Has `googleId` from Google
   - Auto-verified (`isVerified: true`)
   - Cannot login via password endpoint

3. **Linked Account User:**
   - Has both `password` and `googleId`
   - Created via email/password, then linked with Google
   - Can login via both methods

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

```javascript

```

For issues or questions, please refer to the documentation and don't contact me. 

---

**Last Updated:** 2025-11-03
**API Version:** 1.1.0

**Changelog:**
- v1.1.0: Added Google OAuth 2.0 authentication
- v1.0.0: Initial release with email/password authentication
