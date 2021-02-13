const Student = require('../models/studentModel');
const User = require('../models/userModel');
const asyncHandler = require('../middleware/async');

const renderStudent = asyncHandler(async (req, res, next) => {
  const students = await Student.find({}).sort({ dept: 1, register_num: 1 });
  const numOfInterviews = await Student.aggregate([{ $project: { interviewers: { $size: '$interviewers' } } }]);
  console.log(numOfInterviews);
  let interviewsPerStudent = {};
  for (let i = 0; i < numOfInterviews.length; i++) {
    interviewsPerStudent[numOfInterviews[i]._id] = numOfInterviews[i].interviewers;
  }

  res.render('student/index', { students, interviewsPerStudent });
});

const getStudent = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const student = await Student.findById(studentId).populate('interviewers');

  const users = await User.find({});

  res.render('student/view', { student, users });
});

const deleteStudent = asyncHandler(async (req, res, next) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash('success', 'Student Successfully Deleted');
  res.redirect('/students');
});

const assignInterviewerToStudent = asyncHandler(async (req, res, next) => {
  // Get studentId and userId
  const studentId = req.params.id;
  const interviewerId = req.body.user;

  // Push interviewerId to student.interviewers array
  await Student.updateOne({ _id: studentId }, { $push: { interviewers: interviewerId } });

  // Push studentId to users.students array
  await User.updateOne({ _id: interviewerId }, { $push: { students: studentId } });

  req.flash('success', 'Interviewer Successfully Assigned');
  res.redirect(`/students/${studentId}`);
});

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
