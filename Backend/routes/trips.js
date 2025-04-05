const express = require("express");
const Trip = require("../models/Trip"); // Import User model
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/user/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const userTrips = await Trip.find({ ownerEmail: email }); // Assuming userEmail is stored in the trip
      res.json(userTrips);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user trips" });
    }
  });


// Function to calculate distance using Haversine Formula
const haversineDistance = (coord1, coord2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Search route
router.post("/search", async (req, res) => {
  try {
    const { departure, arrival, date, seatsRequired } = req.body;

    if (!departure || !arrival || !date || !seatsRequired) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    const trips = await Trip.find({ date });

    const matchingTrips = trips.filter((trip) => {
      const departureDistance = haversineDistance(departure, trip.departure.coordinates);
      const arrivalDistance = haversineDistance(arrival, trip.arrival.coordinates);

      return (
        departureDistance <= 20 &&
        arrivalDistance <= 20 &&
        trip.maxPassengers >= seatsRequired // Check if enough seats are available
      );
    });

    res.json(matchingTrips);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});
module.exports = router;
