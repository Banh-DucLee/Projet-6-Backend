const express = require('express');
const router = express.Router();

const { validateAuth} = require('../middlewares/validation');

const userCtrl = require('../controllers/auth');

router.post('/signup', validateAuth, userCtrl.signup);
router.post('/login', validateAuth, userCtrl.login);

module.exports = router;