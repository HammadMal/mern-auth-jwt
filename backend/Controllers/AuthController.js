const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTPEmail } = require('../util/emailService');


module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    // req.body.password = hashedPassword;

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({ email, password :  hashedPassword , username, otp, otpExpires, isVerified: false, createdAt });
    await user.save();

    

    const emailSent = await sendOTPEmail(email, otp, username);

    if (!emailSent) {
      // Optionally delete user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send verification email. Please try again.' 
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for OTP verification.',
      data: {
        userId: user._id,
        email: user.email,
        username: user.username
      }
    });

  } 
  
  catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      error: 'Server error. Please try again later.' 
    });
  }
};


module.exports.VerifyOTP = async (req, res, next) => {

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
        return res.status(400).json({ 
            success: false,
            error: 'Please provide email and OTP' 
        });
        }

        // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already verified. Please login.' 
      });
    }

    // Check if OTP expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ 
        success: false,
        error: 'OTP has expired. Please request a new one.',
        expired: true
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid OTP. Please try again.' 
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

        const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();

    }

    catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error. Please try again later.' 
    });
  }


};

module.exports.ResendOTP = async (req, res, next) => {

    try {
        const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide email' 
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already verified. Please login.' 
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.username);

    if (!emailSent) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send OTP email. Please try again.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully! Please check your email.'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error. Please try again later.' 
    });
  }
};

