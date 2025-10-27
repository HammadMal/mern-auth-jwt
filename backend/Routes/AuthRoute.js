const AuthController = require("../Controllers/AuthController");
const router = require("express").Router();


router.post("/signup", AuthController.Signup);

router.post("/verify-otp", AuthController.VerifyOTP);

router.post("/resend-otp", AuthController.ResendOTP);

// router.post("/login", AuthController.Login);

module.exports = router;