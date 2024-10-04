const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createUser = async (req,res) => {
    const { username, email, img, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        username,
        email,
        password,
        profile: img
      });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
  
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}

exports.loginUser = async (req,res) => {
    const { usernameOrEmail, password } = req.body;
    try {
      const user = await User.findOne({ usernameOrEmail });
  
      if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        });
  
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token,
        });
      } else {
        res.status(400).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // find a user by id
  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // update user profile
  exports.updateUserProfile = async (req, res) => {
    const { username, img } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, { username, profile: img }, { new: true });
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  //delete user by id
  exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.user.id);
  
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }