const Score = require('../models/scoreModel');
const asyncHandler = require('../middleware/async');

const renderScores = asyncHandler(async (req, res, next) => {
  // Get all scores and populate the student and the interviewer fields
  const scores = await Score.find({}).sort('-createdAt').populate('student').populate('interviewer');

  res.render('score/index', { scores });
});

module.exports = {
  renderScores,
};
