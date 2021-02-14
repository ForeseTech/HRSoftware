// Include required models
const Incharge = require('../models/inchargeModel');
const User = require('../models/userModel');
const Student = require('../models/studentModel');

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

// @desc       View data for a student incharge
// @route      GET /incharges/:id
// @access     Private (Student Incharge)
const getIncharge = asyncHandler(async (req, res, next) => {
  // Get Incharge ID
  const inchargeId = req.params.id;

  // Get Student Incharge data from DB
  const user = await Incharge.findById(inchargeId).populate({ path: 'interviewer', populate: { path: 'students' } });
  console.log(user);

  res.render('incharge/view', { user, name: req.user.name });
});

// @desc       Assign a student to a particular interviewer
// @route      POST /incharges/:interviewerId/assign_student
// @access     Private (Admin, Student Incharge)
const assignStudentToUser = asyncHandler(async (req, res, next) => {
  // Get register number and userId
  const registerNum = req.body.register_num;
  const interviewerId = req.params.interviewerId;

  // Search for Student
  const student = await Student.findOne({ register_num: parseInt(registerNum) });

  // Get studentId
  const studentId = student['_id'];

  // Push intervirwerId to student.users array
  await Student.updateOne({ _id: studentId }, { $push: { interviewers: interviewerId } });

  // Push studentId to users.students array
  await User.updateOne({ _id: interviewerId }, { $push: { students: studentId } });

  // Success Flash Message
  req.flash('success', 'Student successfully assigned');
  res.redirect(`/incharges/${req.user._id}`);
});

// @desc       Deallocate a student from a particular interviewer
// @route      POST /incharges/:interviewerId/deallocate_student/:studentId
// @access     Private (Admin, Student Incharge)
const deallocateStudentToUser = asyncHandler(async (req, res, next) => {
  // Get interviewerId and studentId
  const interviewerId = req.params.interviewerId;
  const studentId = req.params.studentId;

  // Pop userId from student.users array
  await User.updateOne({ _id: interviewerId }, { $pull: { students: studentId } });

  // Pop studentId from users.students array
  await Student.updateOne({ _id: studentId }, { $pull: { interviewers: interviewerId } });

  // Success Flash Message
  req.flash('success', 'Student Successfully Deallocated.');
  res.redirect(`/incharges/${req.user._id}`);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, req, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // Success Flash Response
  req.flash('success', `Welcome, ${user.name}`);
  res.cookie('token', token, options).redirect(`/incharges/${user._id}`);
};

module.exports = {
  renderLogin,
  loginIncharge,
  logoutIncharge,
  getIncharge,
  assignStudentToUser,
  deallocateStudentToUser,
};
