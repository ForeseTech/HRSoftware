const jwt = require('jsonwebtoken');
const Incharge = require('../models/inchargeModel');
const User = require('../models/userModel');

// Protect Interviewer and Admin Routes
const isLoggedIn = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    // Error Flash Message
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user data in req.user
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    // Error Flash Message
    req.flash('error', 'Please log in to view the page');
    return res.redirect('/users/login');
  }
};

// Protect Interviewer and Admin Routes
const authorizeIncharge = async (req, res, next) => {
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

    // Store Student Incharge data in req.user
    req.user = await Incharge.findById(decoded.id);

    next();
  } catch (err) {
    // Error Flash Message
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

module.exports = { isLoggedIn, authorizeIncharge, authorize };
