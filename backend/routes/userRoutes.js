const express = require("express");
const { registerUser, loginUser, userProfile, checkUsers } = require("../controllers/userController");
const router = express.Router();

// Debug route to check users
router.get("/check-users", async (req, res) => {
  try {
    await checkUsers(req, res);
  } catch (error) {
    console.error("Error in check-users route:", error);
    res.status(500).send({ msg: "Server error checking users" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ msg: "Server error during login" });
  }
});

// Register route
router.post("/register", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ msg: "Server error during registration" });
  }
});

// Profile route
router.get("/profile/:id", async (req, res) => {
  try {
    await userProfile(req, res);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).send({ msg: "Server error fetching profile" });
  }
});


module.exports = router;
