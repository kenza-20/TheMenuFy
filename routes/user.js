const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validateUser')

const router = Router();


router.post('/login',validate, authController.login_post);
router.post("/logout", authController.logout);



module.exports = router;