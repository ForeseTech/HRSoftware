const Interviewer = require('../models/interviewerModel');
const Student = require('../models/studentModel');
const Score = require('../models/scoreModel');

const asyncHandler = require('../middleware/async');

const renderInterviewer = asyncHandler(async (req, res, next) => {
  const interviewers20 = await Interviewer.find({
    interview_date: {
      $gte: new Date(2021, 1, 20),
      $lt: new Date(2021, 1, 21),
    },
  }).populate('students');

  const students20 = await Interviewer.aggregate([
    {
      $match: {
        interview_date: {
          $gte: new Date(2021, 1, 20),
          $lt: new Date(2021, 1, 21),
        },
      },
    },
    { $project: { students: { $size: '$students' } } },
  ]);

  let studentsPerInterviewer20 = {};
  for (let i = 0; i < students20.length; i++) {
    studentsPerInterviewer20[students20[i]._id] = students20[i].students;
  }

  const interviewers21 = await Interviewer.find({
    interview_date: {
      $gte: new Date(2021, 1, 21),
      $lt: new Date(2021, 1, 22),
    },
  }).populate('students');

  const students21 = await Interviewer.aggregate([
    {
      $match: {
        interview_date: {
          $gte: new Date(2021, 1, 21),
          $lt: new Date(2021, 1, 22),
        },
      },
    },
    { $project: { students: { $size: '$students' } } },
  ]);

  let studentsPerInterviewer21 = {};
  for (let i = 0; i < students21.length; i++) {
    studentsPerInterviewer21[students21[i]._id] = students21[i].students;
  }

  res.render('interviewer/index', {
    interviewers20,
    studentsPerInterviewer20,
    interviewers21,
    studentsPerInterviewer21,
  });
});

const getInterviewer = asyncHandler(async (req, res, next) => {
  const interviewerId = req.params.id;
  const interviewer = await Interviewer.findById(interviewerId).populate('students');

  res.render('interviewer/view', { interviewer });
});

const createInterviewer = asyncHandler(async (req, res, next) => {
  await Interviewer.create(req.body);

  req.flash('success', 'New Interviewer Successfully Created');
  res.redirect('/interviewers');
});

const updateInterviewer = asyncHandler(async (req, res, next) => {});

const deleteInterviewer = asyncHandler(async (req, res, next) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash('success', 'Interviewer Successfully Deleted');
  res.redirect('/interviewers');
});

const assignStudentToInterviewer = asyncHandler(async (req, res, next) => {
  // Get register number and interviewerId
  const registerNum = req.body.register_num;
  const interviewerId = req.params.id;

  // Search for Interviewer
  const interviewer = await Interviewer.findById(interviewerId);

  // Search for Student
  const student = await Student.findOne({ register_num: parseInt(registerNum) });

  // Get studentId
  const studentId = student['_id'];

  // Push InterviewerId to student.interviewers array
  student.interviewers.push(interviewerId);
  student.save();

  // Push studentId to interviewers.students array
  interviewer.students.push(studentId);
  interviewer.save();

  // Success Flash Message
  req.flash('success', 'Student successfully assigned');
  res.redirect(`/interviewers/${interviewerId}`);
});

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
  req.flash('success', 'Student successfully scored');
  res.redirect(`/interviewers/${interviewer}`);
});

module.exports = {
  renderInterviewer,
  createInterviewer,
  getInterviewer,
  updateInterviewer,
  deleteInterviewer,
  assignStudentToInterviewer,
  scoreStudent,
};
