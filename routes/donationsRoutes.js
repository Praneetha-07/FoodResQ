// routes/donationRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import Donation from "../models/donations.js";
import User from "../models/User.js"; // Import User model to populate donor info

const router = express.Router();

router.get(
  "/available",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const availableDonations = await Donation.find({ status: "pending" })
        .populate("donor", "name organization") // Populate donor's name and organization
        .sort({ createdAt: -1 });

      res.json({ donations: availableDonations });
    } catch (error) {
      console.error("Error fetching available donations:", error);
      res
        .status(500)
        .json({ message: "Server error fetching available donations." });
    }
  }
);

router.put(
  "/:id/accept-pickup",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const donationId = req.params.id;
      const volunteerId = req.user._id; // ID of the logged-in volunteer

      const donation = await Donation.findById(donationId);

      if (!donation) {
        return res.status(404).json({ message: "Donation not found." });
      }

      if (donation.status !== "pending") {
        return res.status(400).json({
          message:
            "Donation is not available for pickup (status is not pending).",
        });
      }

      // Assign the volunteer and update status
      donation.volunteer = volunteerId;
      donation.status = "picked-up";
      await donation.save();

      res.json({ message: "Donation accepted successfully!", donation });
    } catch (error) {
      console.error("Error accepting pickup:", error);
      res.status(500).json({ message: "Server error accepting pickup." });
    }
  }
);

router.get(
  "/my-pickups",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const volunteerId = req.user._id;
      const myPickups = await Donation.find({
        volunteer: volunteerId,
        status: { $in: ["picked-up", "delivered"] }, // Include pickups and delivered items
      })
        .populate("donor", "name organization phoneNumber address") // Populate donor details
        .sort({ createdAt: -1 });

      res.json({ pickups: myPickups });
    } catch (error) {
      console.error("Error fetching volunteer's pickups:", error);
      res.status(500).json({ message: "Server error fetching your pickups." });
    }
  }
);

router.put(
  "/:id/mark-delivered",
  protect,
  authorizeRoles("volunteer"),
  async (req, res) => {
    try {
      const donationId = req.params.id;
      const volunteerId = req.user._id; // ID of the logged-in volunteer

      const donation = await Donation.findById(donationId);

      if (!donation) {
        return res.status(404).json({ message: "Donation not found." });
      }

      // Ensure the donation is currently 'picked-up' and assigned to this volunteer
      if (donation.status !== "picked-up") {
        return res
          .status(400)
          .json({ message: "Donation is not in 'picked-up' status." });
      }
      if (
        !donation.volunteer ||
        donation.volunteer.toString() !== volunteerId.toString()
      ) {
        return res.status(403).json({
          message: "Not authorized to mark this donation as delivered.",
        });
      }

      // Update status to 'delivered'
      donation.status = "delivered";
      await donation.save();

      res.json({
        message: "Donation marked as delivered successfully!",
        donation,
      });
    } catch (error) {
      console.error("Error marking donation as delivered:", error);
      res
        .status(500)
        .json({ message: "Server error marking donation as delivered." });
    }
  }
);

router.post("/", protect, authorizeRoles("donor"), async (req, res) => {
  const { foodType, quantity, address, readyUntilDate, readyUntilTime } =
    req.body;
  const donor = req.user._id; // Get donor ID from authenticated user

  try {
    const newDonation = new Donation({
      donor,
      foodType,
      quantity,
      address,
      readyUntilDate,
      readyUntilTime,
    });

    const savedDonation = await newDonation.save();
    res.status(201).json({
      message: "Donation submitted successfully!",
      donation: savedDonation,
    });
  } catch (error) {
    console.error("Error submitting donation:", error);
    res
      .status(500)
      .json({ message: "Server error during donation submission." });
  }
});

router.get("/total-food-saved", async (req, res) => {
  try {
    const result = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    const totalFoodSaved = result.length > 0 ? result[0].totalQuantity : 0;
    res.json({ totalFoodSavedKg: totalFoodSaved });
  } catch (error) {
    console.error("Error fetching total food saved:", error);
    res
      .status(500)
      .json({ message: "Server error fetching total food saved." });
  }
});

router.get("/donors-summary", async (req, res) => {
  try {
    const donorsSummary = await Donation.aggregate([
      {
        $group: {
          _id: "$donor",
          totalDonatedQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "users", // The collection name for the User model (usually lowercase and plural)
          localField: "_id",
          foreignField: "_id",
          as: "donorInfo",
        },
      },
      {
        $unwind: "$donorInfo", // Deconstructs the donorInfo array field from the input documents to output a document for each element.
      },
      {
        $match: {
          "donorInfo.role": "donor", // Ensure only actual donors are included
        },
      },
      {
        $project: {
          _id: 0,
          name: "$donorInfo.name",
          organization: "$donorInfo.organization",
          totalDonatedQuantity: 1,
        },
      },
    ]);

    res.json({ donors: donorsSummary });
  } catch (error) {
    console.error("Error fetching donors summary:", error);
    res.status(500).json({ message: "Server error fetching donors summary." });
  }
});

router.get(
  "/my-donations",
  protect,
  authorizeRoles("donor"),
  async (req, res) => {
    try {
      const donations = await Donation.find({ donor: req.user._id }).sort({
        createdAt: -1,
      });
      res.json({ donations });
    } catch (error) {
      console.error("Error fetching my donations:", error);
      res.status(500).json({ message: "Server error fetching donations." });
    }
  }
);

export default router;
