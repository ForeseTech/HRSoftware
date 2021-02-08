const Student = require('../models/studentModel');
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

  res.render('student/view', { student });
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

module.exports = {
  renderStudent,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
