const Student = require('../models/studentModel');
const asyncHandler = require('../middleware/async');

const renderStudent = asyncHandler(async (req, res, next) => {
  const students = await Student.find({});
  res.render('student/index', { students });
});

const createStudent = asyncHandler(async (req, res, next) => {});

const updateStudent = asyncHandler(async (req, res, next) => {});

const deleteStudent = asyncHandler(async (req, res, next) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash('success', 'Student Successfully Deleted');
  res.redirect('/');
});

module.exports = {
  renderStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
