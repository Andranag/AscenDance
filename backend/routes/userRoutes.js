const express = require("express");
const { registerUser, loginUser, userProfile } = require("../controllers/userController")
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile/:id", userProfile)


module.exports = router;
