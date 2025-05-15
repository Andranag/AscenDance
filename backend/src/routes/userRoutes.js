const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers } = require("../controllers/userController");
const router = express.Router();

// Admin can view all users
router.get("/users", protect, authorize(["admin"]), getAllUsers);

// Logged-in users can access their own profile
router.get("/profile", protect, getUserProfile);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
