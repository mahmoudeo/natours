const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getBooking,
} = require('../controllers/bookingController');
const bookingRouter = express.Router();

bookingRouter.get(
  '/checkout-session/:tourId',
  protect,
  restrictTo('user'),
  getCheckoutSession,
);

bookingRouter
  .route('/')
  .get(protect, restrictTo('admin', 'lead-guide'), getAllBookings)
  .post(protect, restrictTo('admin'), createBooking);

bookingRouter
  .route('/:id')
  .get(protect, restrictTo('admin'), getBooking)
  .patch(protect, restrictTo('admin'), updateBooking)
  .delete(protect, restrictTo('admin'), deleteBooking);
module.exports = bookingRouter;
