const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // Import User model
const multer = require("multer");
const nodemailer = require("nodemailer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
});
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select("firstName lastName profilePic");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


// PUT /user/:id - Update user profile
router.put("/:id", upload.fields([{ name: "profilePic" }, { name: "idPhoto" }]), async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const {
        firstName,
        lastName,
        idNumber,
        email,
        age,
        password,
        oldPassword
      } = req.body;
  
      // Check if old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });
  
      // Update fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.idNumber = idNumber || user.idNumber;
      user.email = email || user.email;
      user.age = age || user.age;
  
      // If new password is provided, hash it
      if (password && password.trim() !== "") {
        user.password = await bcrypt.hash(password, 10);
      }
  
      // Update images if provided
      if (req.files["profilePic"]) {
        user.profilePic = req.files["profilePic"][0].buffer.toString("base64");
      }
      if (req.files["idPhoto"]) {
        user.idPhoto = req.files["idPhoto"][0].buffer.toString("base64");
      }
  
      await user.save();
  
      res.json({ message: "Profil mis à jour avec succès !" });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  });
  
  

  // Temporary in-memory store for codes (not for production!)
  const emailVerificationCodes = {};
  
  // POST /user/send-code
  router.post("/send-code", async (req, res) => {
    const { email } = req.body;
  
    if (!email) return res.status(400).json({ message: "Email is required" });
  
    // Generate a 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
  
    // Store it temporarily
    emailVerificationCodes[email] = code;
  
    // Send it via email using nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail", // or any SMTP
        auth: {
          user: "covoitun@gmail.com",
          pass: "jbgq upfm vwnf oyja", // consider using an App Password
        },
      });
  
      await transporter.sendMail({
        from: "Moez_bj@covoiturage.com",
        to: email,
        subject: "Votre code de vérification",
        text: `Votre code de vérification est : ${code}`,
      });
  
      res.json({ message: "Code envoyé avec succès" });
    } catch (error) {
      console.error("Erreur d'envoi d'email :", error);
      res.status(500).json({ message: "Erreur d'envoi de l'email" });
    }
  });
  
  // POST /user/verify-code
  router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
  
    if (emailVerificationCodes[email] === code) {
      delete emailVerificationCodes[email];
      return res.json({ success: true });
    }
  
    res.status(400).json({ success: false, message: "Code incorrect" });
  });
  
  

module.exports = router;
