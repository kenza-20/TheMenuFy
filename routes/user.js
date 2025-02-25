const express = require('express');
const { signupUser } = require('../controlleurs/userController');
const validateUser = require('../middleware/validateUser');
const userModel = require('../models/userModel');


const router = express.Router();

router.post('/signup',validateUser, signupUser);

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

        res.status(200).send(`<h2>Your email has been confirmed! You can now     log in.</h2>`);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


module.exports = router;
