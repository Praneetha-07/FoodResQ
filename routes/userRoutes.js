// routes/userRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // Ensure you have authMiddleware
import User from "../models/User.js"; // Your User model

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private (requires token)
router.put("/profile", protect, async (req, res) => {
  const userId = req.user._id; // User ID comes from the token via `protect` middleware
  const {
    name,
    phoneNumber,
    address,
    gender, // Volunteer specific
    dob, // Volunteer specific
    studyOccupation, // Volunteer specific
    preferredLocation, // Volunteer specific
    organization, // Donor specific
  } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update common fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    // Update role-specific fields
    if (user.role === "volunteer") {
      if (gender) user.gender = gender;
      if (dob) user.dob = dob;
      if (studyOccupation) user.studyOccupation = studyOccupation;
      if (preferredLocation) user.preferredLocation = preferredLocation;
    } else if (user.role === "donor") {
      if (organization) user.organization = organization;
    }

    // You might want to add validation here to ensure fields are of correct type/format
    await user.save(); // Save the updated user

    // Send back the updated user details (excluding password)
    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
        studyOccupation: user.studyOccupation,
        preferredLocation: user.preferredLocation,
        organization: user.organization,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error during profile update." });
  }
});

export default router;
