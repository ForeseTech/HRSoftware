const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// Protect Routes
const isLoggedIn = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash('error', `Please login as admin to perform this action`);
      return res.redirect('/users/login');
    }
    next();
  };
};

module.exports = { isLoggedIn, authorize };
