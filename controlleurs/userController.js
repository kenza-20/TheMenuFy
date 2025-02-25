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
                `<h3>Hello ${name},</h3>
                <p>Your account is pending admin approval. You'll receive an email once approved.</p>
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
        await sendEmail(email, "Welcome to Themenufy!", 
            `<h3>Welcome, ${name}!</h3>
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

        // Envoyer un email avec le code de réinitialisation
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            html: `
                <h3>Password Reset Request</h3>
                <p>We received a request to reset your password.</p>
                <p>Your reset code is: <strong>${resetCode}</strong></p>
                <p>If you didn't request a password reset, please ignore this email.</p>
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

module.exports = { signupUser,forgotPassword,resetPassword};
