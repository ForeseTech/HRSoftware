// Include required models
const Student = require('../models/studentModel');
const User = require('../models/userModel');

// Middleware for handling async methods
const asyncHandler = require('../middleware/async');

// @desc       View all students
// @route      GET /students
// @access     Private (Admin)
const renderStudent = asyncHandler(async (req, res, next) => {
  // Get all students, sort by department and then by register number
  const students = await Student.find({}).sort({ dept: 1, register_num: 1 });

  // Get number of interviews per student
  const numOfInterviews = await Student.aggregate([{ $project: { interviewers: { $size: '$interviewers' } } }]);

  // Convert numOfInterviews to a dictionary-like object
  let interviewsPerStudent = {};
  for (let i = 0; i < numOfInterviews.length; i++) {
    interviewsPerStudent[numOfInterviews[i]._id] = numOfInterviews[i].interviewers;
  }

  res.render('student/index', { students, interviewsPerStudent, name: req.user.name });
});

// @desc       View info of a single student
// @route      GET /students/:id
// @access     Private (Admin)
const getStudent = asyncHandler(async (req, res, next) => {
  // Get studentId from URL
  const studentId = req.params.id;

  // Get student data from DB
  const student = await Student.findById(studentId).populate('interviewers');

  const users = await User.find({});

  res.render('student/view', { student, users, name: req.user.name });
});

// @desc       Delete a student from DB
// @route      DELETE /students/:id
// @access     Private (Admin)
const deleteStudent = asyncHandler(async (req, res, next) => {
  // Find by ID and delete student from DB
  await Student.findByIdAndDelete(req.params.id);

  // Success flash message
  req.flash('success', 'Student Successfully Deleted');
  res.redirect('/students');
});

// @desc       Assign a interviewer to the student
// @route      POST /students/:id/assign_user
// @access     Private (Admin)
const assignInterviewerToStudent = asyncHandler(async (req, res, next) => {
  // Get studentId and userId
  const studentId = req.params.id;
  const interviewerId = req.body.user;

  // Push interviewerId to student.interviewers array
  await Student.updateOne({ _id: studentId }, { $push: { interviewers: interviewerId } });

  // Push studentId to users.students array
  await User.updateOne({ _id: interviewerId }, { $push: { students: studentId } });

  // Success flash message
  req.flash('success', 'Interviewer Successfully Assigned');
  res.redirect(`/students/${studentId}`);
});

// @desc       Assign a interviewer to the student
// @route      POST /students/:studentId/deallocate_user/:interviewerId
// @access     Private (Admin)
const deallocateInterviewerToStudent = asyncHandler(async (req, res, next) => {
  // Get userId and studentId
  const studentId = req.params.studentId;
  const interviewerId = req.params.interviewerId;

  // Pop userId from student.users array
  await User.updateOne({ _id: interviewerId }, { $pull: { students: studentId } });

  // Pop studentId from users.students array
  await Student.updateOne({ _id: studentId }, { $pull: { interviewers: interviewerId } });

  // Success Flash Message
  req.flash('success', 'Interviewer Successfully Deallocated.');
  res.redirect(`/students/${studentId}`);
});

module.exports = {
  renderStudent,
  getStudent,
  deleteStudent,
  assignInterviewerToStudent,
  deallocateInterviewerToStudent,
};
