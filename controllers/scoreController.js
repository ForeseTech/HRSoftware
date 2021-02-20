// Include required models
const Score = require('../models/scoreModel');

// Middleware for handling async methods
const asyncHandler = require('../middleware/async');

// @desc       View scores of completed interviews
// @route      GET /scores
// @access     Private (Admin)
const renderScores = asyncHandler(async (req, res, next) => {
  // Get all scores and populate the student and the interviewer fields
  const scores = await Score.find({}).sort('-createdAt').populate('student').populate('interviewer');

  res.render('score/index', { scores, name: req.user.name, role: req.user.role });
});

// @desc       Delete a score by ID
// @route      GET /scores/:id
// @access     Private (Admin)
const deleteScore = asyncHandler(async (req, res, next) => {
  // Find by Id and delete the user
  const score = await Score.findById(req.params.id);
  score.remove();

  // Success Flash Message
  req.flash('success', 'Score Successfully Deleted');
  res.redirect('/scores');
});

module.exports = {
  renderScores,
  deleteScore,
};
