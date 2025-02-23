const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middl/validate')

const router = Router();


router.post('/login',validate, authController.login_post);
router.post('/add', authController.addUser);
router.post("/logout", authController.logout);



module.exports = router;