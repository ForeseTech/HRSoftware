const express = require('express');
const router = express.Router();

const {
  renderStudents,
  getStudent,
  createStudent,
  deleteStudent,
  assignInterviewerToStudent,
  deallocateInterviewerToStudent,
} = require('../controllers/studentController');

const { isLoggedIn, authorize } = require('../middleware/auth');

// View student info routes
router
  .route('/')
  .get(isLoggedIn, authorize('Admin'), renderStudents)
  .post(isLoggedIn, authorize('Admin'), createStudent);
router.route('/:id').get(isLoggedIn, authorize('Admin'), getStudent);

// Student allocation and de-allocation routes
router.route('/:id/assign_user').put(isLoggedIn, authorize('Admin'), assignInterviewerToStudent);
router
  .route('/:studentId/deallocate_user/:interviewerId')
  .put(isLoggedIn, authorize('Admin'), deallocateInterviewerToStudent);

module.exports = router;
