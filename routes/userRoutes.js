const express = require('express');
const router = express.Router();
const { createUser, loginUser, getUserById, updateUserProfile, deleteUser } = require('../controllers/userController');


router.post('/register',createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);
router.delete('/:id', deleteUser);

module.exports = router;
