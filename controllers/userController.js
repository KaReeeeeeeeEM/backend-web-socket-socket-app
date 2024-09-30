const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.createUser = async (req,res) => {
    const { username, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        username,
        email,
        password,
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
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
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