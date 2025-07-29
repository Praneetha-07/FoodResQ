import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For password hashing

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensures email is unique
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Basic email validation
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", null], // Allow null for optional fields
  },
  dob: {
    type: Date,
  },
  studyOccupation: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["donor", "volunteer"], // Defines the type of user
    required: [true, "Role is required"],
  },
  preferredLocation: {
    // Only for volunteers
    type: String,
    trim: true,
  },
  organization: {
    // Only for donors
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password before saving to DB
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
  }
  next(); // Continue with the save operation
});

// Method to compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
