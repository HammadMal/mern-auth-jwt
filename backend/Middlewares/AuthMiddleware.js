const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.'
    })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.status(401).json({
       success: false,
       message: 'Invalid or expired token. Please login again.'
     })
    } else {
      const user = await User.findById(data.id)
      if (user) {
        req.user = user
        next()
      } else {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        })
      }
    }
  })
}