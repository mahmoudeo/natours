const express = require('express');
const {
  getAllReviews,
  postReview,
  updateReview,
  deleteReview,
  getReview
} = require('./../controllers/reviewsController');
const { protect, restrictTo } = require('./../controllers/authController');
const {
  checkTourExists,
  checkAuthor,
} = require('../controllers/reviewsController');
const { restrictToOwnerOrAdmin } = require('../controllers/handlerFactory');
const { Review } = require('../models/reviewsModel');

const reviewsRouter = express.Router({ mergeParams: true });
reviewsRouter
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), checkTourExists, checkAuthor, postReview);

reviewsRouter
  .route('/:id')
  .get(protect, checkAuthor, getReview)
  .patch(protect, restrictToOwnerOrAdmin(Review), checkAuthor, updateReview)
  .delete(protect, restrictToOwnerOrAdmin(Review), checkAuthor, deleteReview);
module.exports = reviewsRouter;
