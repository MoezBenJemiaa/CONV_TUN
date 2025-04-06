const express = require("express");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/Reservation");
const Trip = require("../models/Trip");
const User = require("../models/User");
const Notification = require("../models/Notification");
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || "yourSecret";

const extractLocationName = (fullAddress) => {
  if (!fullAddress) return "Unknown";
  const parts = fullAddress.split(",");
  return parts.length > 3
    ? parts[3].trim()
    : fullAddress;
};

// POST: Make a reservation
router.post("/", async (req, res) => {
  try {
    const { tripId, passengers, userEmail, userid } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trajet non trouvé" });

    if (trip.ownerEmail === userEmail) {
      return res.status(403).json({ message: "Vous ne pouvez pas réserver votre propre trajet." });
    }

    const existing = await Reservation.findOne({ trip: tripId, user: userid });
    if (existing) {
      return res.status(409).json({ message: "Vous avez déjà réservé ce trajet." });
    }

    const reservation = new Reservation({
      user: userid,
      trip: tripId,
      passengers: passengers || 1,
    });

    await reservation.save();

    // ✅ Get the trip owner's user ID from their email
    const tripOwner = await User.findOne({ email: trip.ownerEmail });
    if (!tripOwner) {
      return res.status(404).json({ message: "Conducteur non trouvé" });
    }
    const user= await User.findById(userid);
    // ✅ Create notification for the trip owner
    await Notification.create({
      text: user.firstName+` a réservé ${passengers} place(s) sur le trajet de `+extractLocationName(trip.departure.name)+" a' "+extractLocationName(trip.arrival.name),
      tripId: tripId,
      user: tripOwner._id, // Send notification to the trip owner
    });

    res.status(201).json({ message: "Réservation effectuée", reservation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Check if reserved
router.get("/check", async (req, res) => {
  try {
    const { tripId, userId } = req.query;

    const reservation = await Reservation.findOne({ trip: tripId, user: userId });

    if (reservation) {
      return res.status(200).json({ message: "Already reserved", reserved: true });
    } else {
      return res.status(200).json({ message: "Not reserved", reserved: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all passengers for a trip
router.get("/trip/:tripId/passengers", async (req, res) => {
  try {
    const { tripId } = req.params;

    const reservations = await Reservation.find({ trip: tripId })
      .populate("user", "firstName lastName profilePic");

    const passengers = reservations.map((reservation) => ({
      id: reservation.user._id,
      name: `${reservation.user.firstName || ""} ${reservation.user.lastName || ""}`.trim(),
      profilePic: reservation.user.profilePic || null,
    }));

    res.status(200).json({ passengers });
  } catch (err) {
    console.error("Error fetching passengers:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des passagers." });
  }
});

// Get reservations by user
router.get("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    if (!userID) {
      return res.status(404).json({ message: "User not found" });
    }

    const reservations = await Reservation.find({ user: userID });

    res.json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel reservation
router.delete("/cancel", async (req, res) => {
  const { tripId, userId } = req.body;

  try {
    const result = await Reservation.findOneAndDelete({ trip: tripId, user: userId });

    if (!result) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // ✅ Get trip to find the owner's email
    const trip = await Trip.findById(tripId);
    const tripOwner = trip ? await User.findOne({ email: trip.ownerEmail }) : null;
    const user= await User.findById(userId);
    // ✅ Send notification to trip owner about cancellation
    await Notification.create({
      text: user.firstName+` a annuler la reservation du trajet de `+extractLocationName(trip.departure.name)+" a' "+extractLocationName(trip.arrival.name),
      tripId: tripId,
      user: tripOwner ? tripOwner._id : "", // Only if owner exists
    });

    res.json({ message: "Réservation annulée avec succès" });
  } catch (err) {
    console.error("Erreur d'annulation:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
