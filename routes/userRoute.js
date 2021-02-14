const express = require('express');
const router = express.Router();

const {
  renderLogin,
  loginUser,
  logoutUser,
  renderUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  assignStudentToUser,
  deallocateStudentToUser,
  scoreStudent,
} = require('../controllers/userController');

const { isLoggedIn, authorize } = require('../middleware/auth');

// Auth Routes
router.route('/login').get(renderLogin).post(loginUser);
router.route('/logout').get(logoutUser);

// CRUD Routes
router.route('/').get(isLoggedIn, authorize('Admin'), renderUsers).post(isLoggedIn, authorize('Admin'), createUser);
router
  .route('/:id')
  .get(isLoggedIn, getUser)
  .put(isLoggedIn, authorize('Admin'), updateUser)
  .delete(isLoggedIn, authorize('Admin'), deleteUser);

// Assign and Deallocation Routes
router.route('/:interviewerId/assign_student').post(isLoggedIn, authorize('Interviewer', 'Admin'), assignStudentToUser);
router
  .route('/:interviewerId/deallocate_student/:studentId')
  .put(isLoggedIn, authorize('Interviewer', 'Admin'), deallocateStudentToUser);

// Score Student Route
router.route('/:interviewerId/students/:studentId').post(isLoggedIn, authorize('Interviewer', 'Admin'), scoreStudent);

module.exports = router;
