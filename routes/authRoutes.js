import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user (donor or volunteer)
// @access  Public
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    address,
    gender,
    dob,
    studyOccupation,
    role, // 'donor' or 'volunteer'
    preferredLocation, // Optional for volunteer
    organization, // Optional for donor
  } = req.body;

  try {
    // Check if user already exists with this email
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Create new user based on role
    if (role === "volunteer") {
      user = new User({
        name,
        email,
        password, // Password will be hashed by pre-save hook in User model
        phoneNumber,
        address,
        gender,
        dob,
        studyOccupation,
        role,
        preferredLocation,
      });
    } else if (role === "donor") {
      user = new User({
        name,
        email,
        password,
        phoneNumber,
        address, // Donors also have address for pickups
        organization,
        role,
      });
    } else {
      return res.status(400).json({ message: "Invalid user role specified." });
    }

    await user.save(); // Save user to database (password gets hashed here)

    const token = generateToken(user._id);

    // Send back the full user object (excluding password) along with the token
    res.status(201).json({
      message: `${role} registered successfully!`,
      userId: user._id,
      email: user.email,
      role: user.role,
      token, // Include the generated JWT token

      // Include all relevant user profile data
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      studyOccupation: user.studyOccupation,
      preferredLocation: user.preferredLocation,
      organization: user.organization,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials (email)." });
    }

    // Check password
    // UserSchema should have a method like `matchPassword` for this
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials (password)." });
    }

    const token = generateToken(user._id);

    // Send back the full user object (excluding password) along with the token
    res.json({
      message: "Logged in successfully!",
      userId: user._id,
      email: user.email,
      role: user.role,
      token, // Include the generated JWT token

      // Include all relevant user profile data
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      studyOccupation: user.studyOccupation,
      preferredLocation: user.preferredLocation,
      organization: user.organization,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

export default router;
