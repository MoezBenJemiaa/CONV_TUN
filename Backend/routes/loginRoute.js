const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import User model
const { jwtSecret } = require("../config/keys");

const router = express.Router();

// LOGIN ROUTE
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email ,pdp:`data:image/jpeg;base64,${user.profilePic}`}, jwtSecret, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
