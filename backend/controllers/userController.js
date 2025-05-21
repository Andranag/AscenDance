const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Debug route to check users
const checkUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error checking users:", error);
    res.status(500).send({ msg: "Server error checking users" });
  }
};

const saltRound = Number(process.env.SALT_ROUND);
const secretKey = process.env.SECRET_KEY;

// Password validation function
const isPasswordValid = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=\[\]{};':"\|,.<>/?]).{8,}$/;
  return regex.test(password);
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ msg: "Please fill all required fields." });
    }

    // Validate password format
    if (!isPasswordValid(password)) {
      return res.status(400).send({
        msg: "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).send({ msg: "Email or username already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const payload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "4h" });

    return res.status(201).send({ msg: "Registration successful!", token });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).send({ msg: "Server error during registration." });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).send({ msg: "Username/Email and Password are required." });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(400).send({ msg: "User not found. Please register." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ msg: "Incorrect password." });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "2h" });

    return res.status(200).send({ msg: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ msg: "Server error during login." });
  }
};

// GET USER PROFILE
const userProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    // Remove sensitive information
    const { password, ...userProfile } = user._doc;
    
    return res.status(200).json(userProfile);
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).send({ msg: "Server error fetching profile" });
  }
};

module.exports = { registerUser, loginUser, userProfile };