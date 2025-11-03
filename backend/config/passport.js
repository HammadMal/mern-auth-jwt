require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/UserModel');


console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Validate email exists
      if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
        return done(new Error('No email provided by Google'), null);
      }

      const email = profile.emails[0].value;

      // Check if user already exists in our db
      let existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with same email
      existingUser = await User.findOne({ email });

      if (existingUser) {
        // Link Google account to existing user and verify them
        existingUser.googleId = profile.id;
        existingUser.isVerified = true;
        await existingUser.save();
        return done(null, existingUser);
      }

      // Create new user (no password for OAuth users)
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: email,
        isVerified: true, // Auto-verify OAuth users
        createdAt: new Date()
        // password is undefined (not set for OAuth users)
      });

      await newUser.save();
      return done(null, newUser);

    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;