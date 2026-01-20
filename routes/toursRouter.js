const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  patchTour,
  deleteTour,
  aliasTopCheap,
  aggregateTours,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/toursController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewsRouter');

const toursRouter = express.Router();
toursRouter.use('/:tourId/reviews', reviewRouter);

toursRouter.route('/tour-stats').get(protect, aggregateTours);
toursRouter.route('/monthly-plan/:year').get(protect, getMonthlyPlan);
toursRouter.route('/top-5-cheap').get(aliasTopCheap, getTours);
toursRouter
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(protect, getToursWithin);

toursRouter.route('/distances/:latlng/unit/:unit').get(protect, getDistances);
toursRouter
  .route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
toursRouter
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages, 
    resizeTourImages,
    patchTour,
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = toursRouter;
