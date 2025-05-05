const express = require('express');
const {validateUser,validateLogin} = require('../middleware/validateUser');
const upload = require('../middleware/upload');
const userModel = require('../models/userModel');
const userController = require('../controlleurs/userController');
const router = express.Router();
const { getBehavioralRecommendations } = require("../controlleurs/userController");
const { getSharedRecommendations } = require('../controlleurs/userController');

router.post('/signup',validateUser, userController.signupUser);
router.post('/login',validateLogin,userController.login_post);
router.post("/logout", userController.logout);
// Route pour demander la réinitialisation du mot de passe
router.post('/forgot-password', userController.forgotPassword);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', userController.resetPassword);

// ✅ Route pour confirmer l'email en utilisant l'ID utilisateur
router.get("/confirm/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver l'utilisateur par ID
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(400).json({ error: "Invalid confirmation link" });
        }

        // Vérifier si l'utilisateur est déjà confirmé
        if (user.confirmed) {
            return res.status(200).json({ message: "Your account is already confirmed" });
        }

        // ✅ Confirmer l'utilisateur
        user.confirmed = true;
        await user.save();

        res.status(200).send(`
<div style="background-color: #f5f5f5; padding: 40px 0;">
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; overflow: hidden;">
    <div style="background-color: #f4ce36; padding: 40px 0;">
      <img src="https://img.icons8.com/ios-filled/100/ffffff/ok.png" width="50" alt="Success" />
    </div>
    <div style="padding: 30px;">
      <h2 style="margin-top: 0;">Thank you for your registration</h2>
      <p style="max-width: 80%; margin: auto; color: #555;">
        Your email has been successfully verified. You can now complete your registration or log in to your account.
      </p>
    </div>
  </div>
</div>

`);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Route pour mettre à jour le profil de l'utilisateur
router.put('/update-profile', upload.single('image'), userController.updateMonProfil);
router.get('/bytoken', userController.getByToken);
// Reservation routes
router.post('/reservations', userController.addReservation);
router.get('/reservations/:userId', userController.getReservationsByUser);
router.get('/reservation/:reservationId', userController.getReservationById);
router.get('/friends/recommendations/:userId', userController.getFriendsRecommendations);
router.get('/last-order/:userId', userController.getLastOrder);
router.get('/favorites/promotions/:userId', userController.getPromoFavorites);
router.post('/favorites/add', userController.addToFavorites);
router.post('/favorites/remove', userController.removeFromFavorites);
router.get("/behavioral-recommendations/:userId", getBehavioralRecommendations);
router.get('/shared-recommendations/:userId', getSharedRecommendations);

module.exports = router;
