const express = require('express');
const passport = require('../config/passport');
const { createSecretToken } = require('../util/SecretToken');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Create JWT token
      const token = createSecretToken(req.user._id);
      
      // Set cookie
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      // Redirect to frontend success page
      res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`);
      
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

module.exports = router;