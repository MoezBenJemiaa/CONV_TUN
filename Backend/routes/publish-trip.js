const express = require('express');
const multer = require('multer');
const Trip = require('../models/Trip');

const router = express.Router();
const upload = multer(); // Multer for parsing FormData

// Route to handle POST request for publishing a trip
router.post('/', upload.none(), async (req, res) => {
    try {
        // Get preferences and stops from the request body
        const preferences = req.body.preferences ? req.body.preferences.split(',') : [];
        const stops = req.body.stops ? JSON.parse(req.body.stops) : [];

        // Create trip data object with the parsed values
        const tripData = {
            departure: {
                name: req.body.departureName,
                coordinates: JSON.parse(req.body.departureCoordinates) // Parse coordinates from frontend
            },
            arrival: {
                name: req.body.arrivalName,
                coordinates: JSON.parse(req.body.arrivalCoordinates) // Parse coordinates
            },
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            date: req.body.date,
            maxPassengers: parseInt(req.body.maxPassengers, 10),
            price: parseFloat(req.body.price),
            reservationType: req.body.reservationType,
            description: req.body.description,
            preferences,
            stops,
            vehicle: {
                type: req.body.vehicleType,
                color: req.body.vehicleColor,
                plate: req.body.vehiclePlate
            },
            ownerEmail: req.body.ownerEmail // The email of the trip owner (extracted from the JWT)
        };

        // Create and save the new trip in the database
        const trip = new Trip(tripData);
        await trip.save();

        // Send a successful response with the trip data
        res.status(201).json({ message: 'Trip published successfully', trip });
    } catch (error) {
        // Handle any errors that occur during the request
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
