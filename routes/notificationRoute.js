// server.js ou notificationController.js (selon la structure de votre projet)
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { sendNotificationToChef } = require('../notificationService'); // Fonction d'envoi de notification

// Route pour créer une notification pour le chef
router.post('/send', async (req, res) => {
    try {
      console.log('📨 Body reçu pour notification :', req.body); // 👈 AJOUTE CECI
  
      const { itemName, itemQuantity, chefid, restoid } = req.body;
  
      if (!itemName || !itemQuantity || !chefid || !restoid) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newNotification = await Notification.create({
        itemName,
        itemQuantity,
        chefid,
        restoid,
      });
  
      await sendNotificationToChef(chefid, newNotification);
  
      res.status(201).json({ message: 'Notification sent successfully', notification: newNotification });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;