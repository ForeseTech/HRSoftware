// Include required models
const Incharge = require('../models/inchargeModel');

// Middleware for handling async methods
const asyncHandler = require('../middleware/async');

// @desc       Page for student incharge login
// @route      GET /incharges/login
// @access     Public
const renderLogin = (req, res, next) => {
  res.render('incharge/login');
};

// @desc       Login Student Incharge
// @route      POST /incharges/login
// @access     Public
const loginIncharge = asyncHandler(async (req, res, next) => {
  // Get username and password from request body
  const { username, password } = req.body;

  // Get user username and password from DB
  const user = await Incharge.findOne({ username: username }).select('+password');

  // Check if user exists
  if (!user) {
    req.flash('error', 'No such student incharge exists. Please contact the tech lead.');
    return res.redirect('/incharges/login');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    // Error Flash Message
    req.flash('error', 'Invalid Login Credentials.');
    return res.redirect('/incharges/login');
  }

  // Send token response
  sendTokenResponse(user, req, res);
});

// @desc       Log the student incharge out
// @route      GET /incharges/logout
// @access     Public
const logoutIncharge = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  // Success Flash Message
  req.flash('success', 'You Have Logged Out');
  res.redirect('/incharges/login');
};

const getIncharge = asyncHandler(async (req, res, next) => {});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, req, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // Success Flash Response
  req.flash('success', `Welcome, ${user.name}`);
  res.cookie('token', token, options).redirect(`/users/${user.interviewer}`);
};

module.exports = {
  renderLogin,
  loginIncharge,
  logoutIncharge,
};
