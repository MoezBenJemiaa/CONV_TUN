const express = require("express");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/Reservation");
const Trip = require("../models/Trip");
const User = require("../models/User");
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "yourSecret";

// POST: Make a reservation
router.post("/", async (req, res) => {
  try {
    // Retrieve user data from the body
    const { tripId, passengers, userEmail, userid } = req.body;

    console.log("Reservation data:", req.body);

    // 1. Get the trip
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trajet non trouvé" });

    // 2. Check if the user is the owner of the trip
    if (trip.ownerEmail === userEmail) {
      return res.status(403).json({ message: "Vous ne pouvez pas réserver votre propre trajet." });
    }

    // Optional: Prevent duplicate reservations
    const existing = await Reservation.findOne({ trip: tripId, user: userid });
    if (existing) {
      return res.status(409).json({ message: "Vous avez déjà réservé ce trajet." });
    }

    // 3. Create the reservation
    const reservation = new Reservation({
      user: userid,
      trip: tripId,
      passengers: passengers || 1,
    });

    await reservation.save();
    res.status(201).json({ message: "Réservation effectuée", reservation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
  
router.get("/check", async (req, res) => {
    try {
      const { tripId, userId } = req.query;
  
      // Find if there is an existing reservation for this user and trip
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

// GET: Passengers for a specific trip
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




module.exports = router;
