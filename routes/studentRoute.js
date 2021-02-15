const express = require('express');
const router = express.Router();

const {
  renderStudent,
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
  .get(isLoggedIn, authorize('Admin'), renderStudent)
  .post(isLoggedIn, authorize('Admin'), createStudent);
router.route('/:id').get(isLoggedIn, authorize('Admin'), getStudent);

// Student allocation and de-allocation routes
router.route('/:id/assign_user').post(isLoggedIn, authorize('Admin'), assignInterviewerToStudent);
router
  .route('/:studentId/deallocate_user/:interviewerId')
  .put(isLoggedIn, authorize('Admin'), deallocateInterviewerToStudent);

module.exports = router;
