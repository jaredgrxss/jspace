const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authentication');


router.get('/login',authControllers.getLogin);
router.post('/login',authControllers.postLogin);

router.get('/signup', authControllers.getSignup);
router.post('/signup',authControllers.postSignup);

router.get('/logout',authControllers.getLogout);


// export our routes
module.exports = router;