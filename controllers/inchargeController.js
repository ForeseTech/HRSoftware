const Incharge = require('../models/inchargeModel');

const asyncHandler = require('../middleware/async');

const renderLogin = (req, res, next) => {
  res.render('incharge/login');
};

const loginIncharge = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const incharge = await Incharge.findOne({ username: username }).select('+password');

  // Check if user exists
  if (!incharge) {
    req.flash('error', 'No such student incharge exists. Please contact the tech lead.');
    return res.redirect('/incharges/login');
  }

  // Check if password matches
  const isMatch = await Incharge.matchPassword(password);
  if (!isMatch) {
    req.flash('error', 'Invalid Login Credentials.');
    return res.redirect('/incharges/login');
  }

  // Send token response
  sendTokenResponse(incharge, req, res);
});

const logoutIncharge = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  req.flash('success', 'You have logged out');
  res.redirect('/incharges/login');
};

// Get token from model, create cookie and send response
const sendTokenResponse = (incharge, req, res) => {
  const token = incharge.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  req.flash('success', `Welcome, ${user.name}`);
  res.cookie('token', token, options).redirect(`/incharges/${incharge.interviewer}`);
};

module.exports = {
  renderLogin,
  loginIncharge,
  logoutIncharge,
};
