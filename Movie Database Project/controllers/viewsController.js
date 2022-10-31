
const Movie = require('../models/movieModel');
const User = require('../models/userModel');
const People = require('../models/peopleModel');

const AppError = require('../Utils/appError');
const catchAsync = require('./../Utils/catchAsync');

exports.getOverview = catchAsync(async(req,res, next)=>{

    console.log('Lop Enter');
    // 1) get movies data from collections
    const movies = await Movie.find();
    const recommendedMovies = await Movie.find({ ratingAverage:{$gt: 7}, imdbRating: {$gte: 7}  });
    const featuredMovies = await Movie.find({ runtime:{$gte: 90}, runtime: {$lt: 110}  });
    // 2) Build Template 
    
    // 3) Rendering that template with the Movie Data 1)
    res.status(200).render('movieOverview',{
        title: "All Movies",
        movies,
        recommendedMovies,
        featuredMovies
    });
});

exports.getMovie = catchAsync(async(req,res,next)=>{
    
    // 1) Get the data for the requested movie from the collection
    const movie = await Movie.findOne({ slug: req.params.slug }).populate({
        path: 'director',
        fields: 'name -_id',
    }).populate({
        path: 'reviews',
        fields: 'name -_id',
    }).populate({
        path: 'writer',
        fields: 'name -_id'
    }).populate({
        path: 'actors',
        fields: 'name -_id'
    });
    
    if(!movie) return next(new AppError('There is no Movie with that name',404));
    
    const similarMovies = await Movie.find({ genre: movie.genre[0], genre: movie.genre[1] });
    // console.log(movie);
    
    res.status(200).render('movie',{
        title: 'The Boy',
        movie,
        similarMovies
    });
});

exports.getUsers = catchAsync(async(req,res, next)=>{
    const users = await User.find();
    
    res.status(200).render('getallUserList',{
        title: "All Users",
        text: "Users",
        url: "users",
        users,
    });
});

exports.getallPeoples = catchAsync(async(req,res, next)=>{
    const users = await People.find();
    
    res.status(200).render('getallUserList',{
        title: "All PEOPLES",
        text: "Peoples",
        url: "peoples",
        users,
    });
});

exports.getUserProfile = catchAsync(async(req,res, next)=>{
    const userSearch = await User.findOne({ slug: req.params.slug }).populate({
        path: 'wishList',
    }).populate({
        path: 'reviews',
    }).populate({
        path: 'following',
    }).populate({
        path: 'followers',
    });
    
    if(!userSearch) return next(new AppError('There is no User with that name',404));
    
    res.status(200).render('userProfile',{
        title: `${userSearch.name}`,
        userSearch,
    });
})

exports.getPeople = catchAsync(async(req,res,next)=>{
    
    // 1) Get the data for the requested movie from the collection
    const people = await People.findOne({ slug: req.params.slug }).populate({
        path: 'movies',
        fields: 'name -_id',
    });
    
    if(!people) return next(new AppError('There is no People with that name',404));
    
    res.status(200).render('people',{
        title: `${people.name}`,
        people,
    });
});

exports.getLoginForm = catchAsync(async(req,res, next)=>{
    res.status(200).render('login',{
        title: 'Login'
    });
});

exports.getSignupForm = catchAsync(async(req,res, next)=>{
    res.status(200).render('signup',{
        title: 'Sign Up '
    })
})

exports.getMyself = catchAsync(async(req,res, next)=>{
    const user = await User.findById(req.user.id).populate({
        path: 'wishList',
    }).populate({
        path: 'reviews',
    }).populate({
        path: 'following',
    }).populate({
        path: 'followers',
    });
    
    res.status(200).render('userPage',{
        title: 'User Profile',
        user,
    });
});

exports.updataMyData= catchAsync(async(req,res, next)=>{
    
    const user = await User.findOne({ name: req.body.prevName});
    
    if(!user) return next(new AppError('There is no User with that name',404));
    
    if(req.body.role === 'admin') return next(new AppError('user cannot be Upgraded to Admin',404));
    
    const updatedUser = await User.findByIdAndUpdate( user.id, { 
        name: req.body.name,
        email: req.body.email,
        DOB: req.body.DOB,
        city: req.body.city,
        country: req.body.country,
        about: req.body.about,
        role: req.body.role,
    },{
        new: true,
        runValidators: true,
    });
    
    return res.redirect('/me');
    // res.status(200).render('userPage',{
    //     title: 'User Profile',
    //     user : req.user,
    // });
});

exports.deleteUser = catchAsync(async(req,res, next)=>{
    const userSearch = await User.findOneAndDelete({ name: req.body.name });
    
    if(!userSearch) return next(new AppError('There is no User with that name',404));
    
    return res.redirect('/me');
});

exports.deleteMovie = catchAsync(async(req,res, next)=>{
    
    console.log(req.body.name);
    const movieSearch = await Movie.findOneAndDelete({ title: req.body.name });
    if(!movieSearch) return next(new AppError('There is no Movie with that name',404));
    return res.redirect('/me');
});

exports.searchData = catchAsync(async(req,res, next)=>{
    console.log(req.body);
    const userSearch = await User.findOne({ name: req.body.name });
    
    if(!userSearch) return next(new AppError('There is no User with that name',404));
    
    res.status(200).render('updateUser',{
        title: `${userSearch.name}`,
        user: req.user,
        userSearch,
    });
});

exports.getDeleteUserform = catchAsync(async(req,res, next)=>{
    res.status(200).render('searchDeleteUser',{
        title: 'Search',
        user: req.user
    });
});

exports.getDeleteMovieform = catchAsync(async(req,res, next)=>{
    res.status(200).render('searchDeleteMovie',{
        title: 'Search',
        user: req.user
    });
});

exports.getAddUserform = catchAsync(async(req,res, next)=>{
    res.status(200).render('addUser',{
        title: 'Add User',
        user: req.user
    });
});

exports.getAddMovieform = catchAsync(async(req,res, next)=>{
    res.status(200).render('addMovie',{
        title: 'Add Movie',
        user: req.user
    });
});

exports.getsearchform = catchAsync(async(req,res, next)=>{
    res.status(200).render('search',{
        title: 'Search',
        user: req.user
    });
});


// // exports.createUser = catchAsync(async(req,res, next)=>{
//     const newUser = await User.create({
//         role: req.body.role,
//         name: req.body.name,
//         email: req.body.email,
//         DOB: req.body.DOB,
//         city: req.body.city,
//         country: req.body.country,
//         about: req.body.about,
//         password: req.body.password,
//         passwordConfirm: req.body.passwordConfirm
//     });
    
//     newUser.password = undefined;
    
//     res.status(201).json({
//         status: 'success',
//         token,
//         data: {
//             user: newUser,
//         }
//     });
// });


