const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { Review } = require('../models/reviewsModel');
const { filterObj } = require('../utils/customHelp');
const Tour = require('../models/toursModel');
const User = require('../models/usersModel');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handlerFactory');

exports.checkAuthor = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const userExists = await User.exists({ _id: req.body.user });

  if (!userExists) return next(new AppError('user not found', 404));
  next();
});

exports.checkTourExists = catchAsync(async (req, res, next) => {
  const tourExists = await Tour.exists({ _id: req.body.tour });
  if (!tourExists && !req.params.tourId)
    return next(new AppError('tour not found', 404));
  next();
});
exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
exports.postReview = createOne(Review);
