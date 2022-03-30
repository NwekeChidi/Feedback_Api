const router         = require('express').Router();
const { body }       = require('express-validator');
const { auth }       = require('../middlewares/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

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
router.post('/logout',
            auth,
            authController.logout);

// edit profile
router.patch('/updateProfile',
            auth,
            userController.uploadImage,
            userController.editProfile);

module.exports = router