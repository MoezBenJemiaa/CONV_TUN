const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET all notifications for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Erreur lors de la récupération des notifications :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});




router.patch("/seen/:id", async (req, res) => {
  console.log(req.params)  
  try {
      
      const updated = await Notification.findByIdAndUpdate(
        req.params.id,
        { seen: true },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      console.error("Erreur mise à jour de notification:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  router.get('/unseen/:userId', async (req, res) => {

    try {
      const count = await Notification.countDocuments({ user: req.params.userId, seen: false });
      
      res.json({ unseenCount: count });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
module.exports = router;