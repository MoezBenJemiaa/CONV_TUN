const express = require("express");
const Trip = require("../models/Trip");
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const User = require('../models/User'); // Import User model
const router = express.Router();
router.use(express.json()); 

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

const extractLocationName = (fullAddress) => {
  if (!fullAddress) return "Unknown";
  const parts = fullAddress.split(",");
  return parts.length > 3 ? parts[3].trim() : fullAddress;
};
router.put('/:id', async (req, res) => {
  const tripId = req.params.id;

  try {
    // Find the trip by ID
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Update the trip with the new data
    trip.departure = req.body.departure || trip.departure;
    trip.arrival = req.body.arrival || trip.arrival;
    trip.stops = req.body.stops || trip.stops;
    trip.departureTime = req.body.departureTime || trip.departureTime;
    trip.arrivalTime = req.body.arrivalTime || trip.arrivalTime;
    trip.date = req.body.date || trip.date;
    trip.maxPassengers = req.body.maxPassengers || trip.maxPassengers;
    trip.price = req.body.price || trip.price;
    trip.reservationType = req.body.reservationType || trip.reservationType;
    trip.preferences = req.body.preferences || trip.preferences;
    trip.description = req.body.description || trip.description;
    trip.vehicle = req.body.vehicle || trip.vehicle;
    trip.ownerEmail = req.body.ownerEmail || trip.ownerEmail;

    // Save the updated trip
    const updatedTrip = await trip.save();

    // Fetch all passengers of the trip
    const reservations = await Reservation.find({ trip: tripId }).populate('user');
    const passengers = reservations.map((reservation) => reservation.user);

    // Notify each passenger about the trip update
    passengers.forEach(async (passenger) => {
      // Create the notification text
      const notificationText = `Le trajet de ${extractLocationName(trip.departure.name)} à ${extractLocationName(trip.arrival.name)} a été mis à jour. Veuillez vérifier les nouvelles informations.`;

      // Create a notification for the passenger
      await Notification.create({
        text: notificationText,
        tripId: tripId,
        user: passenger._id, // Send notification to each passenger
      });
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'An error occurred while updating the trip' });
  }
});

module.exports = router;
