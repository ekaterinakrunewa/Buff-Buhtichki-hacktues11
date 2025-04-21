const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'timelink_secret_key';
const JWT_EXPIRE = '24h';

// Signup controller
const signup = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, password } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, phone, email, hashedPassword]
    );
    
    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      name: `${user.first_name} ${user.last_name}`
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Logout controller
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Verify token controller
const verifyToken = (req, res) => {
  res.status(200).json({ 
    isAuthenticated: true,
    user: req.user
  });
};

// Export all functions
module.exports = {
  signup,
  login,
  logout,
  verifyToken
};