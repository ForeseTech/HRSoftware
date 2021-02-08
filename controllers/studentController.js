const Student = require('../models/studentModel');
const Interviewer = require('../models/interviewerModel');
const asyncHandler = require('../middleware/async');

const renderStudent = asyncHandler(async (req, res, next) => {
  const students = await Student.find({}).sort({ dept: 1, register_num: 1 });
  const numOfInterviews = await Student.aggregate([
    { $match: {} },
    { $project: { interviewers: { $size: '$interviewers' } } },
  ]);

  let interviewsPerStudent = {};
  for (let i = 0; i < numOfInterviews.length; i++) {
    interviewsPerStudent[numOfInterviews[i]._id] = numOfInterviews[i].interviewers;
  }

  res.render('student/index', { students, interviewsPerStudent });
});

const getStudent = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const student = await Student.findById(studentId).populate('interviewers');

  const interviewers = await Interviewer.find({});

  res.render('student/view', { student, interviewers });
});

const createStudent = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  await Student.create(req.body);

  res.redirect('/students');
});

const updateStudent = asyncHandler(async (req, res, next) => {});

const deleteStudent = asyncHandler(async (req, res, next) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash('success', 'Student Successfully Deleted');
  res.redirect('/students');
});

const assignInterviewerToStudent = asyncHandler(async (req, res, next) => {
  // Get studentId and interviewerId
  const studentId = req.params.id;
  const interviewerId = req.body.interviewer;

  // Search for Interviewer
  const interviewer = await Interviewer.findById(interviewerId);

  // Search for Student
  const student = await Student.findById(studentId);

  // Push InterviewerId to student.interviewers array
  student.interviewers.push(interviewerId);
  student.save();

  // Push studentId to interviewers.students array
  interviewer.students.push(studentId);
  interviewer.save();

  req.flash('success', 'Interviewer Successfully Assigned');
  res.redirect(`/students/${student._id}`);
});

module.exports = {
  renderStudent,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  assignInterviewerToStudent,
};
