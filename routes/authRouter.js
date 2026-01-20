const express = require('express');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateMe,
  deleteMe,
  deActivateMe,
  protect,
  getMe,
  logout,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/authController');
const { getUser } = require('../controllers/usersController');
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:token', resetPassword);
authRouter.get('/logout', logout);

authRouter.use(protect);
authRouter.patch('/changePassword', changePassword);
authRouter.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
authRouter.delete('/deactivateMe', deActivateMe);
authRouter.delete('/deleteMe', deleteMe);
authRouter.get('/me', getMe, getUser);

module.exports = authRouter;
