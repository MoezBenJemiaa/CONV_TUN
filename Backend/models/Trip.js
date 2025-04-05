const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    departure: {
        name: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    arrival: {
        name: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    stops: [{ name: String, price: Number }],
    departureTime: String,
    arrivalTime: String,
    date: String,
    maxPassengers: Number,
    price: Number,
    reservationType: String,
    preferences: [String],
    description: String,
    vehicle: {
        type: {
            type: String,
            required: true
        },
        color: String,
        plate: String
    },
    ownerEmail: { 
        type: String, 
        required: true 
    }  
});

module.exports = mongoose.model('Trip', tripSchema);
