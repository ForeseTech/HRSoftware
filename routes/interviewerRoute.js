const express = require('express');
const router = express.Router();

const {
  renderInterviewer,
  createInterviewer,
  getInterviewer,
  updateInterviewer,
  deleteInterviewer,
} = require('../controllers/interviewerController');

router.route('/').get(renderInterviewer).post(createInterviewer);
router.route('/:id').get(getInterviewer).put(updateInterviewer).delete(deleteInterviewer);

module.exports = router;
