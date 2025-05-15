const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers, validateToken, initiatePasswordReset, completePasswordReset, verifyEmail, resendVerificationEmail } = require("../controllers/userController");
const router = express.Router();

// Admin can view all users
router.get("/users", protect, authorize(["admin"]), getAllUsers);

// Logged-in users can access their own profile
router.get("/profile", protect, getUserProfile);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Token validation route
router.get('/validate-token', protect, validateToken);

// Password reset routes
router.post("/forgot-password", initiatePasswordReset);
router.post("/reset-password", completePasswordReset);

module.exports = router;
