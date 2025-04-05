const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passengers: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", reservationSchema);