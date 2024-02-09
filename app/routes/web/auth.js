const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controllers
const loginController = require('app/http/controllers/auth/loginController');
const registerController = require('app/http/controllers/auth/registerController');
const forgotpasswordcontroller = require('app/http/controllers/auth/forgotpasswordcontroller')
const resetpasswordcontroller = require('app/http/controllers/auth/resetpasswordcontroller')
const authredirect = require('app/http/controllers/auth/authredirect')
//Validator
const registervalidator = require('app/http/validators/registerValidator')
const forgotPasswordValidator = require('app/http/validators/forgotPasswordValidator')
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator')
const loginvalidator = require('app/http/validators/loginValidator')
// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');

// Home Routes
router.get('/', authredirect.authtologin)
router.get('/login', loginController.showLoginForm);
router.post('/login', loginController.loginProccess)
router.get('/register', registerController.showRegsitrationForm);
router.post('/register', registerController.registerProccess);
router.get('/password/reset', forgotpasswordcontroller.showforgotpassword);
router.post('/password/email', forgotPasswordValidator.handle(), forgotpasswordcontroller.sendpasswordlink);
router.get('/password/reset/:token', resetpasswordcontroller.showResetPassword);
router.post('/password/reset/', resetPasswordValidator.handle(), resetpasswordcontroller.resetPasswordProccess);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/register' }))
module.exports = router;