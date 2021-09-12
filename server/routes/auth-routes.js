const passport = require('passport');
const router = require('express').Router();
const authControls = require('../controllers/auth-controls');


router.post('/signup', authControls.signup);

router.post('/login', authControls.login);

router.get('/login/success', authControls.authUser);

router.get('/logout', authControls.logout);

router.get('/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/google/redirect', authControls.gSignin);

router.get('/linkedin', passport.authenticate('linkedin', { state: true }));

router.get('/linkedin/redirect', authControls.ldSignin);


module.exports = router;

