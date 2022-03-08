const router = require('express').Router();
const { body } = require('express-validator');
const { auth } = require('../middlewares/auth');
const authController = require('../controllers/authController');

// create user
router.post('/signUp',
            // Validation
            // check email and password
            body('email').isEmail(),
            body('password').isLength({ min: 6}).matches(/\d/),
            authController.signup);

// login
router.post('/login',
            authController.login);

// logout
router.get('/logout',
            auth,
            authController.logout);

module.exports = router