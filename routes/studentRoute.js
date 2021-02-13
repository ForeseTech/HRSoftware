const express = require('express');
const router = express.Router();

const {
  renderStudent,
  getStudent,
  deleteStudent,
  assignInterviewerToStudent,
  deallocateInterviewerToStudent,
} = require('../controllers/studentController');

const { isLoggedIn, authorize } = require('../middleware/auth');

router.route('/').get(isLoggedIn, authorize('Admin'), renderStudent);
router.route('/:id').get(isLoggedIn, authorize('Admin'), getStudent);
router.route('/:id/assign_user').post(isLoggedIn, authorize('Admin'), assignInterviewerToStudent);
router
  .route('/:studentId/deallocate_user/:interviewerId')
  .put(isLoggedIn, authorize('Admin'), deallocateInterviewerToStudent);

module.exports = router;
