const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createUser, loginUser } = require('../controllers/userController');


router.post('/register', protect ,createUser);
router.post('/login', protect, loginUser);

module.exports = router;
