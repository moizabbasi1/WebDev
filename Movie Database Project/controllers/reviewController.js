const Review = require('./../models/reviewModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');
const APIFeatures = require('./../Utils/apiFeatures');


exports.getAllReviews = catchAsync( async( req, res, next) => {
    
    let filter = {};
    if(req.params.movieId) filter = { movie: req.params.movieId };
    const features = new APIFeatures(Review.find(filter),req.query).filter().sort().limitFiels().paginate();  
    const reviews = await features.query;
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        }
    });
});
exports.getReview = catchAsync(async (req,res, next)=>{

    const review = await Review.findById(req.params.id);
    if(!review) return next(new AppError('No Such Review Found', 404));
    res.status(200).json({ 
        status: "success",
        data:{
            review,
        }
    });
});

exports.setMovieUserIds = (req, res, next)=> {
    // Allowed nested routes 
    if(!req.body.movie) req.body.movie = req.params.movieId;
    if(!req.body.user) req.body.user = req.user.id;
    
    next();
};

exports.createReview = catchAsync( async ( req, res, next) =>{
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            review: newReview,
        }
    });
});

exports.updateReview = catchAsync(async (req,res, next)=>{
    
    //to return new doc we set new: true
    const review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
    });
    if(!review) return next(new AppError('No Such Review Found', 404));
    
    res.status(200).json({ 
        status: "success",
        data:{
            review,
        }
    });
});

exports.deleteReview = catchAsync(async(req, res, next) => {
    
    const doc = await Review.findByIdAndDelete(req.params.id);
    
    if(!doc) return next(new AppError('No Such User Found with That ID', 404));
    res.status(204).json({
        status: "Success",
        data: null,
    });
});