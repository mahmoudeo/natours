const express = require('express');
const { isLoggedIn, protect } = require('../controllers/authController');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  protectView,
  getMyBookingTours,
} = require('../controllers/viewsController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, protectView, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get(
  '/my-booking-tours',
  protectView,
  protect,
  isLoggedIn,
  getMyBookingTours,
);

router.post('/submit-user-data', protect, isLoggedIn, updateUserData);

module.exports = router;
