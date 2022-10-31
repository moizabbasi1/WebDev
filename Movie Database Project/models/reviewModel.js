const mongoose = require('mongoose');
const Movie = require('./movieModel');

const reviewSchema = new mongoose.Schema({
        review:{
            type: String,
            required: [true, 'Review cannot be empty'],
        },
        rating:{
            type: Number,
            min: 1,
            max: 10,
        },
        createdAt:{
            type: Date,
            default: Date.now(),
        },
        movie:{
            type: mongoose.Schema.ObjectId,
            ref: 'Movie',
            required: [true, 'Review Must be belong to Movie'],
        },
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review Must be belong to User'],
        },
    },
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true},
    }
);

//here we actually want each can only do one review on a tour so thats
//we have to use compound index and pass some options for it which actually enables the user to do review only once.
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name email photo'
    });
    
    next();
});

//to calculate the no of total review and average rating.
reviewSchema.statics.calcAverageRatings = async function (movieId) {
    const stats = await this.aggregate([
      {
        $match: { movie: movieId },
      },
      {
        $group: {
          _id: '$movie',
          nRating: { $sum: 1},
          avgRating: { $avg: '$rating' },
        },
      },
    ]);
    // basically this will only work here when there is a data in the stats array here.
    if (stats.length > 0) {
      await Movie.findByIdAndUpdate(movieId, {
        ratingQuantity: stats[0].nRating,
        ratingAverage: stats[0].avgRating,
      });
    } else {
      await Movie.findByIdAndUpdate(movieId, {
        ratingAverage: 9,
        ratingQuantity: 0,
      });
    }
  };
  
  reviewSchema.post('save', function () {
    //this points to the current Review
    // this.constructor is actually point to the current Model
    this.constructor.calcAverageRatings(this.movie);
  });
  
  // findByIdAndUpdate
  // findByIdAndDelete
  reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log(this.r);
    next();
  });
  // we have used a very populated technique here in order to pass the data from pre to post middleware
  reviewSchema.post(/^findOneAnd/, async function () {
  
    await this.r.constructor.calcAverageRatings(this.r.movie);
  });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;