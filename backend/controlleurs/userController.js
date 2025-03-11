const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const bcrypt = require('bcrypt');
const sendEmail = require('../emailService');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Generate Token
const createToken = (_id, role) => {
    if (!process.env.SECRET) {
        throw new Error("JWT Secret is missing! Make sure to define SECRET in your .env file.");
    }
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '100d' });
};

const signupUser = async (req, res) => {
    const { name, surname, email, password, role } = req.body;

    try {
        // 🔍 Validation des champs
        if (!name || !surname || !email || !password ||  !role) {
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
        const confirmed = false; // Confirmed par défaut à false

        const user = await User.create({ name, surname, email, password: hash, role, approved,confirmed });

        // 🎟 Génération du Token
        const token = createToken(user._id, user.role);

        // 📩 Notification par email
        if (role === 'restaurant' && !approved) {
            await sendEmail(email, "Approval Pending", 
                `<h3>Hello ${name},☺️</h3>
                <p>Your account is pending admin approval 🕰️. You'll receive an email once approved.</p>
                <p>Best regards,<br><strong>Themenufy Team</strong></p>`
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
        await sendEmail(email, "Welcome to Themenufy!🍝", 
            `<h3>Welcome, ${name}!☺️</h3>
            <p>We're excited to have you on board.</p>
            <p>Click the button below to log in:</p>
            <table cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                    <td align="center" bgcolor="#007BFF" style="border-radius: 5px; padding: 10px;">
                        <a href="${loginUrl}" target="_blank" 
                           style="display: inline-block; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; background-color: #007BFF; padding: 10px 20px; border-radius: 5px;">
                           confirmer
                        </a>
                    </td>
                </tr>
            </table>
            <p>Best regards,<br><strong>Themenufy Team</strong></p>`     
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

    if (user.confirmed === false) {
      return res.status(403).json({ message: "Connexion refusée. Vous devez confirmer votre compte." });
    }

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
  
      // Réponse avec le token
      res.json({
        message: 'Connexion réussie.',
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        userRole:user.role, userId : user._id
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

      //const token =jwt.sign({id: user._id}, "jwt_secret_key",{expiresIn:"1d"})
      // Envoyer un email avec le code de réinitialisation
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Code',
         // text: `http://localhost:5173/reset/${user._id}/${token}`,
          html: `
              <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h3 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            color: #7f8c8d;
          }
          .reset-code {
            font-size: 20px;
            font-weight: bold;
            color: #e74c3c;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #bdc3c7;
            text-align: center;
          }
          .footer a {
            color: #3498db;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h3>Password Reset Request</h3>
          <p>We received a request to reset your password. If this was not you, please ignore this email.</p>
          <p>Your password reset code is:</p>
          <p class="reset-code">${resetCode}</p>
          <p>Enter this code on the password reset page to proceed with changing your password.</p>
          <p>If you didn’t request a password reset, please ignore this email.</p>
          <div class="footer">
            <p>Need help? <a href="mailto:support@example.com">Contact support</a></p>
          </div>
        </div>
      </body>
    </html>

          `,
          
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


  console.log("Received resetCode:", resetCode);
    console.log("Received newPassword:", newPassword);

  try {
      // Vérifier si le code est valide et non expiré
      const user = await User.findOne({ resetCode, resetCodeExpiration: { $gt: Date.now() }, });
      console.log("User found:", user); // Log the user to see if it's found
console.log("Reset Code Expiration:", user?.resetCodeExpiration);
      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired reset code' });
      }

      // Hacher le nouveau mot de passe
      const salt= await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);  // Le "10" représente le nombre de "salts rounds"

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



module.exports = { signupUser,login_post,logout,forgotPassword,resetPassword};
