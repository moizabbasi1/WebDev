const fs = require('fs');
const Movie = require('../models/movieModel');
// const People = require('./../models/peopleModel');
const AppError = require('../Utils/appError');
const APIFeatures = require('./../Utils/apiFeatures');
const catchAsync = require('./../Utils/catchAsync');

exports.aliasTopfeatured = (req,res,next)=>{
    
    req.query.limit = '5';
    req.query.sort = '-imdbRating,-ratingAverage';
    // req.query.fields = 'Title,Year,Runtime,imdbRating,ratingAverage,Plot';
    next();
}

exports.aliasTopPopular = (req,res, next)=>{
    req.query.limit = '6';
    req.query.sort = '-imdbVotes,-ratingQuantity';
    // req.query.fields = 'Title,Year,Runtime,imdbRating,ratingAverage,Plot';
    console.log(req.query);
    next();
}

exports.aliasTopSimilar = (req,res, next)=>{
    req.query.limit = '5';
    req.query = '{Director : Howard Deutch}';
    req.query.sort = '-imdbRating, -ratingReview';
    next();
}

exports.getAllMovies = catchAsync(async(req,res, next)=>{
        //Execute the Query
        const features = new APIFeatures(Movie.find(),req.query).filter().sort().limitFiels().paginate();
        
        const movies = await features.query;
        // const movies = await query;
        res.status(200).json({ 
            status: "success",
            result: movies.length,
            data:{
                movies,
            }
        });
});
exports.createMovie = catchAsync(async (req,res, next) => {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            movies: newMovie,
        },
    });
});
exports.getMovie = catchAsync(async (req,res, next)=>{

    const movie = await Movie.findById(req.params.id);
    //movies.findOne({_id: req.params.id});
    if(!movie) return next(new AppError('No Such Movie Found', 404));
    res.status(200).json({ 
        status: "success",
        data:{
            movie,
        }
    });
});
exports.updateMovie = catchAsync(async (req,res, next)=>{
    
    //to return new doc we set new: true
    const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
    });
    if(!movie) return next(new AppError('No Such Movie Found', 404));
    
    res.status(200).json({ 
        status: "success",
        
        data:{
            movie,
        }
    });
});
exports.deleteMovie = catchAsync(async (req,res, next)=>{
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if(!movie) return next(new AppError('No Such Movie Found', 404));
        res.status(204).json({ 
            status: "success",
            data:null,
        });
});


exports.getMoviesStat = catchAsync(async (req,res, next)=>{
    const stats = await Movie.aggregate([
        {
            $match: { ratingAverage: { $gte: 6.5} }
        },
        {
            //this stage basically used to group on the basis of diff fields
            $group: {
                //_id actually can be used to group on the basis of diff fields
                _id: { $toUpper: '$Director' },
                // _id:  '$ratingAverage' ,
                numMovie: { $sum: 1 },
                numRating: { $sum: '$ratingQuantity' },
                avgRating: { $avg: '$ratingAverage' },
            },
        },
        {
            $sort: { avgRating: 1}
        }
    ]);
    
    res.status(200).json({ 
        status: "success",
        result: stats.length,
        data: {
            stats
        }
    });
});


exports.similarMovie = catchAsync(async (req,res, next)=>{
    const movie = await Movie.aggregate([
        {
            $unwind: '$Genre',
        },
        {
            $match: { ratingAverage: { $gte: 6.5} }
        },
        {
            $group: {
                _id: { $toUpper: '$Genre' },
                numMovie: { $sum: 1 },
                movies: { $push: '$Title'}
            }
        },
        {   //add the Genre field
            $addFields: { Genre : '$_id'}
        },
        {   //hide the id 
            $project: { _id: 0}
        },
        {
            $sort: { 
                numMovie: -1
            }
        }
    ]);
    res.status(200).json({ 
        status: "success",
        result: movie.length,
        data: {
            movie
        }
    });
    
});