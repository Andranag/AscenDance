const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  getAllUsers, 
  validateToken, 
  initiatePasswordReset, 
  completePasswordReset,
  logHashedPassword
} = require("../controllers/userController");
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

// Token Validation Route
router.get("/validate", validateToken);

// Debug route for logging hashed password (DEVELOPMENT ONLY)
router.post("/debug-hash", logHashedPassword);

module.exports = router;
