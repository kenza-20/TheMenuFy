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
router.get('/users', userController.getAllUsers);



// Route pour mettre à jour le profil de l'utilisateur
router.put('/update-profile', upload.single('image'), userController.updateMonProfil);
router.get('/bytoken', userController.getByToken);
// Reservation routes
router.get('/getAllReservation', userController.getAllReservation);
router.post('/reservations', userController.addReservation);
router.get('/get-user/:userId', userController.getUserById);
router.get('/reservations/:userId', userController.getReservationsByUser);
router.get('/reservation/:reservationId', userController.getReservationById);
router.get('/friends/recommendations/:userId', userController.getFriendsRecommendations);
router.get('/last-order/:userId', userController.getLastOrder);
router.get('/favorites/promotions/:userId', userController.getPromoFavorites);
router.post('/favorites/add', userController.addToFavorites);
router.post('/favorites/remove', userController.removeFromFavorites);
router.get("/behavioral-recommendations/:userId", getBehavioralRecommendations);
router.get('/shared-recommendations/:userId', getSharedRecommendations);

router.get('/level/:userId',userController.getOrderCountAndLoyaltyLevel);


module.exports = router;


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - email
 *         - password
 *         - role
 *         - tel
 *       properties:
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [user, restaurant]
 *         tel:
 *           type: string
 *         approved:
 *           type: boolean
 *         confirmed:
 *           type: boolean
 *         image:
 *           type: string
 *         foodLikes:
 *           type: string
 *         foodHates:
 *           type: string
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *         neighborhood:
 *           type: string
 * 
 *     Reservation:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *         numberOfGuests:
 *           type: integer
 *         specialRequests:
 *           type: string
 * 
 *     PasswordReset:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         newPassword:
 *           type: string
 * 
 *     Recommendation:
 *       type: object
 *       properties:
 *         id_dish:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         description:
 *           type: string
 *         count:
 *           type: integer

 * tags:
 *   - name: Users
 *     description: Gestion des utilisateurs
 *   - name: Reservations
 *     description: Gestion des réservations
 *   - name: Favorites
 *     description: Gestion des favoris

 * paths:
 *   /user/signup:
 *     post:
 *       summary: Inscription d'un nouvel utilisateur
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         201:
 *           description: Utilisateur créé avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   token:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   role:
 *                     type: string
 *         400:
 *           description: Données invalides ou validation échouée
 * 
 *   /user/login:
 *     post:
 *       summary: Connexion utilisateur
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Connexion réussie
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   token:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         401:
 *           description: Authentification échouée
 * 
 *   /user/logout:
 *     post:
 *       summary: Déconnexion utilisateur
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Déconnexion réussie
 * 
 *   /user/forgot-password:
 *     post:
 *       summary: Demande de réinitialisation de mot de passe
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       responses:
 *         200:
 *           description: Email de réinitialisation envoyé
 *         404:
 *           description: Email non trouvé
 * 
 *   /user/reset-password:
 *     post:
 *       summary: Réinitialisation du mot de passe
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordReset'
 *       responses:
 *         200:
 *           description: Mot de passe modifié avec succès
 *         400:
 *           description: Code invalide ou expiré
 * 
 *   /user/confirm/{id}:
 *     get:
 *       summary: Confirmation d'email
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Email confirmé avec succès
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *         400:
 *           description: Lien de confirmation invalide
 * 
 *   /user/users:
 *     get:
 *       summary: Liste tous les utilisateurs
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Liste des utilisateurs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 * 
 *   /user/update-profile:
 *     put:
 *       summary: Mise à jour du profil utilisateur
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       consumes:
 *         - multipart/form-data
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 tel:
 *                   type: string
 *       responses:
 *         200:
 *           description: Profil mis à jour
 * 
 *   /user/bytoken:
 *     get:
 *       summary: Récupère l'utilisateur par token
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Informations utilisateur
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 * 
 *   /user/getAllReservation:
 *     get:
 *       summary: Liste tous les reservation
 *       tags: [Reservations]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Liste des reservation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 * 
 * 
 *   /user/reservations:
 *     post:
 *       summary: Ajoute une réservation
 *       tags: [Reservations]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       responses:
 *         201:
 *           description: Réservation créée
 * 
 *   /user/get-user/{userId}:
 *     get:
 *       summary: Récupère un utilisateur par ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Détails de l'utilisateur
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 * 
 *   /user/reservations/{userId}:
 *     get:
 *       summary: Récupère les réservations d'un utilisateur
 *       tags: [Reservations]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Liste des réservations
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 * 
 *   /user/behavioral-recommendations/{userId}:
 *     get:
 *       summary: Recommandations personnalisées
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Liste des recommandations
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Recommendation'
 * 
 *   /user/shared-recommendations/{userId}:
 *     get:
 *       summary: Recommandations partagées
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Liste des recommandations
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Recommendation'
 * 
 *   /user/level/{userId}:
 *     get:
 *       summary: Niveau de fidélité
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: Niveau de fidélité et nombre de commandes
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   orderCount:
 *                     type: integer
 *                   loyaltyLevel:
 *                     type: string
 * 
 *   /user/favorites/add:
 *     post:
 *       summary: Ajouter aux favoris
 *       tags: [Favorites]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 dishId:
 *                   type: string
 *       responses:
 *         200:
 *           description: Ajouté aux favoris
 * 
 *   /user/favorites/remove:
 *     post:
 *       summary: Retirer des favoris
 *       tags: [Favorites]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 dishId:
 *                   type: string
 *       responses:
 *         200:
 *           description: Retiré des favoris
 */
