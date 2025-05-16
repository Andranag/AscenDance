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
// Token Validation Route (public)
router.get("/validate-token", validateToken);

// Password reset routes
router.post("/forgot-password", initiatePasswordReset);
router.post("/reset-password", completePasswordReset);

// Protected routes
router.get("/validate", protect, validateToken);

// Debug route for logging hashed password (DEVELOPMENT ONLY)
router.post("/debug-hash", logHashedPassword);

module.exports = router;
