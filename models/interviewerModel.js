const mongoose = require('mongoose');

const InterviewerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  interview_date: {
    type: Date,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
});

const Interviewer = mongoose.model('Interviewer', InterviewerSchema, 'Interviewers');
module.exports = Interviewer;
