const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt"); // Import User model
const multer = require("multer");
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
  

  

module.exports = router;
