const AuthController = require("../Controllers/AuthController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();


router.post("/signup", AuthController.Signup);

router.post("/verify-otp", AuthController.VerifyOTP);

router.post("/resend-otp", AuthController.ResendOTP);

router.post("/login", AuthController.Login);

router.post("/logout", AuthController.Logout);

router.get("/protected", AuthMiddleware.requireAuth, AuthController.ProtectedRoute);

module.exports = router;