const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middl/validate')

const router = Router();


// router.post('/login', validate, authController.login_post); // Temporarily comment this out to test
router.post('/login', authController.login_post);  // Just use the controller for now
router.post("/logout", authController.logout);



module.exports = router;