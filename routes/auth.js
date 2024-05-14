const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validation');

const userCtrl = require('../controllers/auth');

router.post('/signup', validator, userCtrl.signup);
router.post('/login', validator, userCtrl.login);

module.exports = router;