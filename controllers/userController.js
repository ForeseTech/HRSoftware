const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Score = require('../models/scoreModel');

const asyncHandler = require('../middleware/async');

// @desc       List all participating users
// @route      GET /users
// @access     Private / Admin
const renderUsers = asyncHandler(async (req, res, next) => {
  // Get all users
  const users = await User.find({}).populate('students');

  // Aggregate number of students per user
  const students = await User.aggregate([
    { $match: { role: 'Interviewer' } },
    { $project: { count: { $size: '$students' } } },
  ]);

  let studentsPerInterviewer = {};
  for (let i = 0; i < students.length; i++) {
    studentsPerInterviewer[students[i]._id] = students[i].count;
  }

  res.render('user/index', {
    users,
    studentsPerInterviewer,
  });
});

// @desc       Create an user
// @route      POST /users
// @access     Private / Admin
const createUser = asyncHandler(async (req, res, next) => {
  // Get data passed in request body
  let user = req.body;

  // Set username and password
  if (user.role === 'Admin') {
    user['username'] = `${user['name'].split(' ')[0]}@forese.in`.toLowerCase();
    user['password'] = '654321';
  } else if (user.role === 'Interviewer') {
    user['username'] = `${user['name'].split(' ')[0]}_${user['company'].split(' ')[0]}`.toLowerCase();
    user['password'] = `${user['name'].split(' ')[0]}_${user['company'].split(' ')[0]}`.toLowerCase();
  } else if (user.role === 'Incharge') {
    user['username'] = `${user['name'].split(' ')[0]}@forese.in`.toLowerCase();
    user['password'] = '123456';
  }

  await User.create(user);

  // Success Flash Message
  req.flash('success', 'New User Successfully Created');
  res.redirect('/users');
});

// @desc       Page for user login
// @route      GET /users/login
// @access     Public
const renderLogin = (req, res, next) => {
  res.render('user/login');
};

// @desc       Login user
// @route      POST /users/login
// @access     Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username }).select('+password');

  // Check if user exists
  if (!user) {
    req.flash('error', 'No such user exists. Please contact your student incharge.');
    return res.redirect('/users/login');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    req.flash('error', 'Invalid Login Credentials.');
    return res.redirect('/users/login');
  }

  // Send token response
  sendTokenResponse(user, req, res);
});

// @desc       Logout user
// @route      GET /users/logout
// @access     Public
const logoutUser = (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
};

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('students');

  res.render('user/view', { user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  // Find by Id and update it with data passed in the request body
  await User.findByIdAndUpdate(req.params.id, req.body);

  // Success Flash Message
  req.flash('success', 'user Details Successfully Updated');
  res.redirect('/users');
});

const deleteUser = asyncHandler(async (req, res, next) => {
  // Find by Id and delete the user
  await User.findByIdAndDelete(req.params.id);

  // Success Flash Message
  req.flash('success', 'user Successfully Deleted');
  res.redirect('/users');
});

const assignStudentToUser = asyncHandler(async (req, res, next) => {
  // Get register number and userId
  const registerNum = req.body.register_num;
  const interviewerId = req.params.interviewerId;

  // Search for Student
  const student = await Student.findOne({ register_num: parseInt(registerNum) });

  // Get studentId
  const studentId = student['_id'];

  // Push userId to student.users array
  await Student.updateOne({ _id: studentId }, { $push: { interviewers: interviewerId } });

  // Push studentId to users.students array
  await User.updateOne({ _id: interviewerId }, { $push: { students: studentId } });

  // Success Flash Message
  req.flash('success', 'Student successfully assigned');
  res.redirect(`/users/${interviewerId}`);
});

const deallocateStudentToUser = asyncHandler(async (req, res, next) => {
  // Get userId and studentId
  const interviewerId = req.params.interviewerId;
  const studentId = req.params.studentId;

  // Pop userId from student.users array
  await User.updateOne({ _id: interviewerId }, { $pull: { students: studentId } });

  // Pop studentId from users.students array
  await Student.updateOne({ _id: studentId }, { $pull: { interviewers: interviewerId } });

  // Success Flash Message
  req.flash('success', 'Student Successfully Deallocated.');
  res.redirect(`/users/${interviewerId}`);
});

const scoreStudent = asyncHandler(async (req, res, next) => {
  const user = req.params.interviewerId;
  const student = req.params.studentId;

  const scores = {};
  scores['professionalAppearence'] = req.body.professionalAppearence ? req.body.professionalAppearence : 0;
  scores['managerialAptitude'] = req.body.managerialAptitude ? req.body.managerialAptitude : 0;
  scores['generalIntelligence'] = req.body.generalIntelligence ? req.body.generalIntelligence : 0;
  scores['technicalKnowledge'] = req.body.technicalKnowledge ? req.body.technicalKnowledge : 0;
  scores['communicationSkills'] = req.body.communicationSkills ? req.body.communicationSkills : 0;
  scores['selfConfidence'] = req.body.selfConfidence ? req.body.selfConfidence : 0;

  const comments = req.body.comments;

  await Score.create({ user, student, scores, comments });

  // Success Flash Message
  req.flash('success', 'Student successfully scored');
  res.redirect(`/users/${user}`);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, req, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (user.role === 'Admin') {
    req.flash('success', `Welcome, ${user.name}`);
    res.cookie('token', token, options).redirect(`/users`);
  } else if (user.role === 'Interviewer') {
    req.flash('success', `Welcome, ${user.name}`);
    res.cookie('token', token, options).redirect(`/users/${user._id}`);
  } else if (user.role === 'Incharge') {
    req.flash('success', `Welcome, ${user.name}`);
    res.cookie('token', token, options).redirect(`/users/${user.interviewer}`);
  }
};

module.exports = {
  renderUsers,
  createUser,
  renderLogin,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  assignStudentToUser,
  deallocateStudentToUser,
  scoreStudent,
};
