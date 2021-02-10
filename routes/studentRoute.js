const express = require('express');
const router = express.Router();

const {
  renderStudent,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  assignInterviewerToStudent,
  deallocateInterviewerToStudent,
} = require('../controllers/studentController');

router.route('/').get(renderStudent).post(createStudent);
router.route('/:id').get(getStudent).put(updateStudent).delete(deleteStudent);
router.route('/:id/assign_interviewer').post(assignInterviewerToStudent);
router.route('/:studentId/deallocate_interviewer/:interviewerId').put(deallocateInterviewerToStudent);

module.exports = router;
