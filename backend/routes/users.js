const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  deactivateUser,
  activateUser,
  getUserStats
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/stats')
  .get(getUserStats);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/:id/role')
  .put(updateUserRole);

router.route('/:id/deactivate')
  .put(deactivateUser);

router.route('/:id/activate')
  .put(activateUser);

module.exports = router;