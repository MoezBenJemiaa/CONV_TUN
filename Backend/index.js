const express = require("express");
const cors = require("cors");
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");
const publish_trip = require("./routes/publish-trip");
const getUser = require("./routes/User");
const getreservation = require("./routes/reservation");
const Notification = require("./routes/handlNotifications");
const getTrip = require("./routes/trips");
const connectDB = require("./db");

const app = express();
app.use(express.json()); 
const PORT = 5000;

app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/publish-trip", publish_trip);
app.use("/user", getUser);
app.use("/reservation", getreservation);
app.use("/notifications", Notification);
app.use("/trip", getTrip);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
