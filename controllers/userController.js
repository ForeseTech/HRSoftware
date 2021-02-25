// Include required models
const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Incharge = require('../models/inchargeModel');
const Score = require('../models/scoreModel');

// Middleware for handling async methods
const asyncHandler = require('../middleware/async');

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

  // Success flash response
  req.flash('success', 'You Have Logged Out');
  res.redirect('/users/login');
};

// @desc       List all participating users
// @route      GET /users
// @access     Private (Admin)
const renderUsers = asyncHandler(async (req, res, next) => {
  // Get all users
  const users = await User.find({}).sort('-createdAt').populate('students');

  // Get all student incharges
  const incharges = await Incharge.find({}).populate('interviewer');

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
    incharges,
    studentsPerInterviewer,
    name: req.user.name,
    role: req.user.role,
  });
});

// @desc       Create an user
// @route      POST /users
// @access     Private (Admin)
const createUser = asyncHandler(async (req, res, next) => {
  // Get data passed in request body
  let user = req.body;

  // Set username and password
  if (user.role === 'Admin') {
    user['username'] = `${user['name'].split(' ')[0]}@forese.in`.toLowerCase();
    user['password'] = '654321';
    await User.create(user);
  } else if (user.role === 'Interviewer') {
    user['username'] = `${user['name'].split(' ')[0]}_${user['company'].split(' ')[0]}`.toLowerCase();
    user['password'] = `${user['name'].split(' ')[0]}_${user['company'].split(' ')[0]}`.toLowerCase();
    await User.create(user);
  } else if (user.role === 'Incharge') {
    user['username'] = `${user['name'].split(' ')[0]}@forese.in`.toLowerCase();
    user['password'] = '123456';
    await Incharge.create(user);
  }

  // Success Flash Message
  req.flash('success', 'New User Successfully Created');
  res.redirect('/users');
});

// @desc       Get details of a particular interviewer/student incharge
// @route      GET /users/:id
// @access     Private (Admin, Interviewer)
const getUser = asyncHandler(async (req, res, next) => {
  // Get User ID
  const interviewerId = req.params.id;

  // Get user data from DB
  const user = await User.findById(interviewerId).populate('students');

  // Get all students
  const students = await Student.find({}).sort({ dept: 1, register_num: 1 });

  // Get scores of students who have been interviewed by the user
  const scores = await Score.find({ interviewer: interviewerId }).populate('student');

  res.render('user/view', { user, students, scores, name: req.user.name, role: req.user.role });
});

// @desc       Delete particular interviewer/student incharge
// @route      DELETE /users/:id
// @access     Private (Admin)
const deleteUser = asyncHandler(async (req, res, next) => {
  // Find by Id and delete the user
  const user = await User.findById(req.params.id);
  user.remove();

  // Success Flash Message
  req.flash('success', 'User Successfully Deleted');
  res.redirect('/users');
});

// @desc       Assign a student to a particular interviewer
// @route      POST /users/:interviewerId/assign_student
// @access     Private (Admin, Student Incharge)
const assignStudentToUser = asyncHandler(async (req, res, next) => {
  // Get register number and userId
  // const registerNum = req.body.register_num;
  const interviewerId = req.params.interviewerId;
  const students = req.body.students;

  // Push intervirwerId to student.users array
  if (Array.isArray(students)) {
    students.forEach(async (student) => {
      await Student.updateOne({ _id: student }, { $push: { interviewers: interviewerId } });
    });
  } else {
    await Student.updateOne({ _id: students }, { $push: { interviewers: interviewerId } });
  }

  // Push studentId(s) to users.students array
  await User.updateOne({ _id: interviewerId }, { $push: { students: students } });

  // Success Flash Message
  req.flash('success', 'Student(s) Successfully Assigned');
  res.redirect(`/users/${interviewerId}`);
});

// @desc       Deallocate a student from a particular interviewer
// @route      POST /users/:interviewerId/deallocate_student/:studentId
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
  res.redirect(`/users/${interviewerId}`);
});

// @desc       Assign Scores to a Student
// @route      POST /users/:interviewerId/students/:studentId
// @access     Private (Interviewer)
const scoreStudent = asyncHandler(async (req, res, next) => {
  const interviewer = req.params.interviewerId;
  const student = req.params.studentId;

  const scores = {};
  scores['professionalAppearence'] = req.body.professionalAppearence ? req.body.professionalAppearence : 0;
  scores['managerialAptitude'] = req.body.managerialAptitude ? req.body.managerialAptitude : 0;
  scores['generalIntelligence'] = req.body.generalIntelligence ? req.body.generalIntelligence : 0;
  scores['technicalKnowledge'] = req.body.technicalKnowledge ? req.body.technicalKnowledge : 0;
  scores['communicationSkills'] = req.body.communicationSkills ? req.body.communicationSkills : 0;
  scores['selfConfidence'] = req.body.selfConfidence ? req.body.selfConfidence : 0;

  const comments = req.body.comments;

  await Score.create({ interviewer, student, scores, comments });

  // Success Flash Message
  req.flash('success', 'Student Successfully Scored');
  res.redirect(`/users/${interviewer}`);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, req, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  // Redirect according to user role
  if (user.role === 'Admin') {
    req.flash('success', `Welcome, ${user.name}`);
    res.cookie('token', token, options).redirect('/users');
  } else if (user.role === 'Interviewer') {
    req.flash('success', `Welcome, ${user.name}`);
    res.cookie('token', token, options).redirect(`/users/${user._id}`);
  }
};

module.exports = {
  renderLogin,
  loginUser,
  logoutUser,
  renderUsers,
  createUser,
  getUser,
  deleteUser,
  assignStudentToUser,
  deallocateStudentToUser,
  scoreStudent,
};
