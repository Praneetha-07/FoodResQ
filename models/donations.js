import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (volunteer who accepts)
    default: null, // Initially null, set when a volunteer accepts
  },
  foodType: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  readyUntilDate: {
    type: Date,
    required: true,
  },
  readyUntilTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "picked-up", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", DonationSchema);

export default Donation;
