const express = require('express');
const router = express.Router();

const {
  renderInterviewer,
  getInterviewer,
  createInterviewer,
  updateInterviewer,
  deleteInterviewer,
  assignStudentToInterviewer,
} = require('../controllers/interviewerController');

router.route('/').get(renderInterviewer).post(createInterviewer);
router.route('/:id').get(getInterviewer).put(updateInterviewer).delete(deleteInterviewer);
router.route('/:id/add_student').post(assignStudentToInterviewer);

module.exports = router;
