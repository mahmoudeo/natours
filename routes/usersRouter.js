const express = require('express');
const usersRouter = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const {
  getUsers,
  getUser,
  patchUser,
  deleteUser,
} = require('../controllers/usersController');

usersRouter.route('/').get(protect, restrictTo('admin'), getUsers);
usersRouter
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .patch(protect, restrictTo('admin'), patchUser)
  .delete(protect, restrictTo('admin'), deleteUser);

module.exports = usersRouter;
