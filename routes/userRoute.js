const express = require('express');
const router = express.Router();

const {
  renderUsers,
  createUser,
  renderLogin,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  assignStudentToUser,
  deallocateStudentToUser,
  scoreStudent,
} = require('../controllers/userController');

const { isLoggedIn, authorize } = require('../middleware/auth');

router.route('/').get(isLoggedIn, authorize('Admin'), renderUsers).post(isLoggedIn, authorize('Admin'), createUser);
router.route('/login').get(renderLogin).post(loginUser);
router.route('/logout').get(logoutUser);
router
  .route('/:id')
  .get(isLoggedIn, getUser)
  .put(isLoggedIn, authorize('Admin'), updateUser)
  .delete(isLoggedIn, authorize('Admin'), deleteUser);
router.route('/:interviewerId/assign_student').post(isLoggedIn, authorize('Interviewer', 'Admin'), assignStudentToUser);
router
  .route('/:interviewerId/deallocate_student/:studentId')
  .put(authorize('Interviewer', 'Admin'), deallocateStudentToUser);
router.route('/:interviewerId/students/:studentId').post(authorize('Interviewer', 'Admin'), scoreStudent);

module.exports = router;
