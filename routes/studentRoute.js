const express = require('express');
const router = express.Router();

const {
  renderStudent,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  assignInterviewerToStudent,
} = require('../controllers/studentController');

router.route('/').get(renderStudent).post(createStudent);
router.route('/:id').get(getStudent).put(updateStudent).delete(deleteStudent);
router.route('/:id/assign_interviewer').post(assignInterviewerToStudent);

module.exports = router;
