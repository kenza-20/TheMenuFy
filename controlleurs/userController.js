const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const bcrypt = require('bcrypt');
const sendEmail = require('../emailService');
const crypto = require('crypto');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const Reservation = require('../models/reservationModel'); 
const Order = require('../models/orderModel'); // si pas déjà importé
// Adjust the path if needed
require('dotenv').config();

// Generate Token
const createToken = (_id, role) => {
    if (!process.env.SECRET) {
        throw new Error("JWT Secret is missing! Make sure to define SECRET in your .env file.");
    }
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '100d' });
};

const signupUser = async (req, res) => {
    const { name, surname, email, password, role, tel } = req.body;

    try {
        // 🔍 Validation des champs
        if (!name || !surname || !email || !password ||  !role ||!tel) {
            throw new Error('All fields must be filled');
        }
        if (!validator.isEmail(email)) {
            throw new Error('Email not valid');
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error('Password must be at least 8 characters long, with uppercase, lowercase, number, and symbol');
        }

        // 🔍 Vérification si l'email existe déjà
        const exists = await User.findOne({ email });
        if (exists) {
            throw new Error('Email already in use');
        }

        // 🔑 Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // ✅ Création de l'utilisateur
        const approved = role !== 'restaurant'; // Auto-approve unless restaurant
        const confirmed = true; // Confirmed par défaut à false

        const user = await User.create({ name, surname, email, password: hash, role, tel,approved,confirmed });
        console.log("✅ USER CREATED:", user);  // <--- AJOUTE CECI

        // 🎟 Génération du Token
        const token = createToken(user._id, user.role);
        user.token = token;
await user.save();
        // 📩 Notification par email
        if (role === 'restaurant' && !approved) {
  

            await sendEmail(email, "Approval Pending", 
                `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #f4ce36; padding: 40px 0; text-align: center;">
      <img src="https://img.icons8.com/ios-filled/100/ffffff/secured-letter.png" width="50" alt="Approval Icon" />
    </div>
    <div style="padding: 30px; text-align: center;">
      <h2>Approval Pending</h2>
      <p>Hi ${name},</p>
      <p>Your account is currently pending approval by our admin team.</p>
      <p>You’ll receive another email once your account is approved and ready to use.</p>
      <p>Thank you for your patience!</p>
    </div>
    <div style="text-align: center; padding: 20px 10px; font-size: 12px; color: #aaa;">
      <p><a href="#" style="color: #aaa; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #aaa; text-decoration: none;">Contact</a></p>
    </div>
  </div>
  `
            );

            return res.status(201).json({ 
                message: "Signup successful. Waiting for admin approval.", 
                token,
                userId: user._id,  
                role: user.role 
            });
        }

        res.status(200).json({ name, surname, email, role, token, userId: user._id, confirmed: user.confirmed});

        // ✅ Envoi d'un email de bienvenue aux utilisateurs approuvés
        const loginUrl = `http://localhost:3000/api/user/confirm/${user._id}`;
        await sendEmail(email, "Email verification",
            `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #f4ce36; padding: 40px 0; text-align: center;">
      <img src="https://img.icons8.com/ios-filled/100/ffffff/secured-letter.png" width="50" alt="Verify Icon" />
    </div>
    <div style="padding: 30px; text-align: center;">
      <h2>Email verification</h2>
      <p>Hi ${name},</p>
      <p>You're almost set to start enjoying <strong>Themenufy</strong>. Simply click the button below to verify your email address and get started.</p>
      <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #f4ce36; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 20px; font-weight: bold;">
        Verify my email address
      </a>
    </div>
    <div style="text-align: center; padding: 20px 10px; font-size: 12px; color: #aaa;">
      <p><a href="#" style="color: #aaa; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #aaa; text-decoration: none;">Contact</a></p>
    </div>
  </div>
  `
        );

       

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Récupérer l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier si l'utilisateur est validé et confirmé
        if (user.role === 'restaurant' || user.approved === false) {
            return res.status(403).json({ message: "Connexion refusée. Il faut attendre la validation du compte." });
        }

// if (user.confirmed === false) {
//     return res.status(403).json({ message: "Connexion refusée. Vous devez confirmer votre compte." });
// }


        // Comparer le mot de passe envoyé avec celui stocké dans la DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Enregistrer le token dans la base de données
        user.token = token;
        await user.save();

        // Réponse avec le token
        res.json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

const blacklist = new Set();
const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token

  if (!token) {
    return res.status(400).json({ message: "Token manquant." });
  }

  blacklist.add(token); // Ajouter à la blacklist
  res.json({ message: "Déconnexion réussie." });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,   
      pass: process.env.EMAIL_PASS   
  }
});


// Fonction pour demander la réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Vérifier si l'email existe dans la base de données
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found');
          return res.status(400).json({ error: 'Email not found' });
      }

      // Générer un code de réinitialisation
      const resetCode = crypto.randomBytes(3).toString('hex'); // Code de 6 caractères

      // Enregistrer le code dans l'utilisateur (dans un champ temporaire)
      user.resetCode = resetCode;
      user.resetCodeExpiration = Date.now() + 3600000; // Le code expire dans 1 heure
      await user.save();
      console.log(user)
      // Envoyer un email avec le code de réinitialisation
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Code',
          html: `
              <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #f4ce36; padding: 40px 0; text-align: center;">
      <img src="https://img.icons8.com/ios-filled/100/ffffff/secured-letter.png" width="50" alt="Reset Icon" />
    </div>
    <div style="padding: 30px; text-align: center;">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password.</p>
      <p>Your reset code is:</p>
      <p style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #333;">${resetCode}</p>
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
    </div>
    <div style="text-align: center; padding: 20px 10px; font-size: 12px; color: #aaa;">
      <p><a href="#" style="color: #aaa; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #aaa; text-decoration: none;">Contact</a></p>
    </div>
  </div>
          `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Reset code sent to your email' });
  } catch (error) {
      console.error('Error during password reset process:', error);
      res.status(500).json({ error: 'Something went wrong' });
  }
};

// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { resetCode, newPassword } = req.body;

  try {
      // Vérifier si le code est valide et non expiré
      const user = await User.findOne({ resetCode, resetCodeExpiration: { $gt: Date.now() } });
      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired reset code' });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);  // Le "10" représente le nombre de "salts rounds"

      // Mettre à jour le mot de passe de l'utilisateur
      user.password = hashedPassword;
      user.resetCode = undefined; // Effacer le code de réinitialisation
      user.resetCodeExpiration = undefined; // Effacer l'expiration du code
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
  }
};

// Fonction pour mettre à jour le profil de l'utilisateur
// Fonction pour mettre à jour le profil de l'utilisateur
const updateMonProfil = async (req, res) => {
  const { name, surname, email, password, allergies, foodLikes, foodHates, tel, image, neighborhood } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie l’unicité de l’email si modifié
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
    }

    // Mise à jour des champs
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (tel) user.tel = tel;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (image) user.image = image;  // 🟡 ADD THIS LINE
    if (foodLikes) user.foodLikes = foodLikes;
    if (foodHates) user.foodHates = foodHates;
    if (allergies) user.allergies = allergies;
    if (neighborhood) user.neighborhood = neighborhood;

    await user.save();

    res.status(200).json({ message: "Profil mis à jour avec succès", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




const getByToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id; // supporte les deux cas
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        tel: user.tel,
        confirmed: user.confirmed,
        password: user.password,
        image: user.image,
        foodLikes: user.foodLikes || "",
        foodHates: user.foodHates || "",
        allergies: user.allergies || [],
        neighborhood: user.neighborhood || ""
      }
    });
  } catch (error) {
    console.error("Erreur dans getByToken:", error);
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};



const addReservation = async (req, res) => {
  const { userId, date, time, numberOfGuests, specialRequests, userEmail } = req.body;

  try {
    // Use new keyword to create ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Create the reservation
    const reservation = await Reservation.create({
      userId: userObjectId,
      date,
      time,
      numberOfGuests,
      specialRequests,
    });

    // Prepare the confirmation email content
    const subject = 'Reservation Confirmation';
    const htmlContent = `
      <h1>Reservation Confirmed!</h1>
      <p>Thank you for your reservation. Here are the details:</p>
      <ul>
        <li><strong>Date:</strong> ${reservation.date}</li>
        <li><strong>Time:</strong> ${reservation.time}</li>
        <li><strong>Number of Guests:</strong> ${reservation.numberOfGuests}</li>
        <li><strong>Special Requests:</strong> ${reservation.specialRequests || 'None'}</li>
      </ul>
      <p>We look forward to serving you!</p>
    `;

    // Send the confirmation email
    await sendEmail(userEmail, subject, htmlContent);

    // Respond with success
    res.status(201).json({ message: 'Reservation added and confirmation email sent', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getReservationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reservations = await Reservation.find({ userId });

    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found' });
    }

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservationById = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/user/friends/recommendations/:userId
const getFriendsRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("➡️ Requête reçue pour l'utilisateur ID:", userId);

    const user = await User.findById(userId).populate('friends');
    if (!user) {
      console.log("❌ Utilisateur introuvable avec l'ID:", userId);
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    console.log("✅ Utilisateur trouvé:", user.name);
    console.log("👥 Données brutes des amis (user.friends):", user.friends);

    // Récupérer un tableau d'IDs sous forme de String
    const friendsArray = Array.isArray(user.friends) ? user.friends : [];
    const friendsIds = friendsArray.map(friend => {
      const id = friend._id ? friend._id.toString() : friend.toString();
      console.log("➡️ ID ami extrait:", id);
      return id;
    });

    console.log("📋 Liste des IDs d'amis:", friendsIds);

    if (friendsIds.length === 0) {
      console.log("ℹ️ Aucun ami trouvé, on retourne une liste vide.");
      return res.status(200).json([]);
    }

    // **IMPORTANT** : Forcer la conversion des IDs en String pour la comparaison
    const orders = await Order.find({
      id_user: { $in: friendsIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    console.log("🧾 Commandes récupérées pour les amis:", orders.length);
    if (orders.length === 0) {
      console.log("⚠️ Aucun plat commandé par les amis.");
    }

    const recommendationsMap = new Map();
    for (const order of orders) {
      console.log("🍽️ Analyse commande:", order.name);
      if (!recommendationsMap.has(order.id_dish)) {
        recommendationsMap.set(order.id_dish, {
          id_dish: order.id_dish,
          name: order.name,
          image: order.image,
          description: order.description,
          count: 1
        });
      } else {
        recommendationsMap.get(order.id_dish).count += 1;
      }
    }

    const recommendations = Array.from(recommendationsMap.values()).sort((a, b) => b.count - a.count);
    console.log("✅ Recommandations finales:", recommendations);
    
    res.status(200).json(recommendations);

  } catch (error) {
    console.error("🛑 Erreur dans getFriendsRecommendations:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};





module.exports = { signupUser,login_post,logout,forgotPassword,resetPassword,updateMonProfil,addReservation,getReservationsByUser,getByToken , getReservationById,  getFriendsRecommendations // ← ✅ Il manquait celui-là
};
