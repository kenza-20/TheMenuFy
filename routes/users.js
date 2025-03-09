const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Hachage du mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);  // 10 est le nombre de "salts"
        
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Ajouter un utilisateur (Admin uniquement)
router.post('/', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json(err);
    }
});
// Récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
});

// Modifier un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
});


// Bloquer un utilisateur
router.put('/block/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `Utilisateur ${user.isBlocked ? 'bloqué' : 'débloqué'}` });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Consulter tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Approver un utilisateur (Admin uniquement)
router.put('/approve/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        user.validated = true;
        await user.save();
        res.json({ message: 'Utilisateur approuvé avec succès' });
    } catch (err) {
        res.status(400).json(err);
    }
});


module.exports = router;
