const express = require('express');
const router = express.Router();

const {
  renderInterviewer,
  getInterviewer,
  createInterviewer,
  updateInterviewer,
  deleteInterviewer,
  assignStudentToInterviewer,
  scoreStudent,
} = require('../controllers/interviewerController');

router.route('/').get(renderInterviewer).post(createInterviewer);
router.route('/:id').get(getInterviewer).put(updateInterviewer).delete(deleteInterviewer);
router.route('/:id/assign_student').post(assignStudentToInterviewer);
router.route('/:interviewerId/students/:studentId').post(scoreStudent);

module.exports = router;
