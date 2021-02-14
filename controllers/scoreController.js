const Score = require('../models/scoreModel');

const renderScores = async (req, res, next) => {
  const scores = await Score.find({}).sort('-createdAt').populate('student').populate('interviewer');

  res.render('score/index', { scores });
};

module.exports = {
  renderScores,
};
