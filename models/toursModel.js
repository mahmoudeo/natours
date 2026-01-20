const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      lowercase: true,
    },
    slug: String,
    ratingsAverage: { type: Number, default: 4.5  , min: [1, 'Rating must be above 1.0'], max: [5, 'Rating must be below 5.0'] , set: val => Math.round(val * 10) / 10},
    ratingsQuantity: { type: Number, default: 0 },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
      min: [1, 'A tour must have a duration at least 1 day'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [1, 'A tour must have a group size at least 1 person'],
      max: [40, 'A tour must have a group size less or equal then 40 people'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be below regular price`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });
tourSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});
//Embedding Guides into Tours
// tourSchema.pre('save' , async function(next){
//   const guidesPromises = this.guides?.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  if(!this.getOptions().select) {
    return next();
  };
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {

  next();
});


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
