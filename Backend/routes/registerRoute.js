const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const { jwtSecret } = require("../config/keys");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// REGISTER ROUTE
router.post("/", upload.fields([{ name: "profilePic" }, { name: "idPhoto" }]), async (req, res) => {
    try {
        const { firstName, lastName, idNumber, email, age, password } = req.body;

        // Convert images to base64
        const profilePic = req.files["profilePic"] ? req.files["profilePic"][0].buffer.toString("base64") : null;
        const idPhoto = req.files["idPhoto"] ? req.files["idPhoto"][0].buffer.toString("base64") : null;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            idNumber,
            email,
            age,
            password: hashedPassword,
            profilePic,
            idPhoto,
        });

        // Save user to DB
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email, pdp: `data:image/jpeg;base64,${newUser.profilePic}` }, jwtSecret, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
