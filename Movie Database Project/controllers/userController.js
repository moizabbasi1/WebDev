const AppError = require('../Utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const APIFeatures = require('./../Utils/apiFeatures');

const filterObj = (obj, ...allowedFields)=> {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getMe = catchAsync(async (req,res, next) => {
    const user = await User.findById(req.user.id);
    if(!user) return next(new AppError('No Such User Found', 404));
    res.status(200).json({ 
        status: "success",
        data:{
            user,
        }
    });
});
exports.updateMe = catchAsync(async (req,res,next) => {
    // create error if user post password data 
    if(req.body.password || req.body.passwordConfirm) {
        return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
    }
    
    if(req.body.role === 'admin') return next(new AppError('You can only Update to contributor', 403));
    
    // 2) filter out unwanted fields name
    const filterBody = filterObj(req.body, 'name', 'email', 'role');
    // 3) update the User 
    const updatedUser = await User.findByIdAndUpdate( req.user.id, filterBody, {
        new: true,
        runValidators : true,
    });
    
    //send back the Status
    res.status(200).json({
        status: "success",
        data:{
            user: updatedUser,
        }
    });
});
exports.deleteMe = catchAsync(async (req,res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false});
    
    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.addMovieWishList = catchAsync(async (req,res,next) => {
    // create error if user post password data 
    if(req.body.password || req.body.passwordConfirm) {
        return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
    }
    
    if(!req.body.movieId) return next(new AppError('Please provide the Movie Id', 404));
        
    const UpdatedObj =  await User.findByIdAndUpdate( req.user.id, {
        $push:{ wishList: req.body.movieId }}, 
        {
            new: true,
            runValidators : true,
        });
    
    //send back the Status
    res.status(200).json({
        status: "success",
        data:{
            user: UpdatedObj,
        }
    });
});

exports.removeMovieWishList = catchAsync(async (req,res,next) => {
    // create error if user post password data 
    if(req.body.password || req.body.passwordConfirm) {
        return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
    }
    
    if(!req.body.movieId) return next(new AppError('Please provide the Movie Id', 404));
        
    const UpdatedObj =  await User.findByIdAndUpdate( req.user.id, {
        $pull:{ wishList: req.body.movieId }}, 
        {
            new: true,
            runValidators : true,
        });
    
    //send back the Status
    res.status(200).json({
        status: "success",
        data:{
            user: UpdatedObj,
        }
    });
});

exports.addfollow = catchAsync(async (req,res,next) => {
    // create error if user post password data 
    if(req.body.password || req.body.passwordConfirm) {
        return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
    }
    
    if(!req.body.followId) return next(new AppError('Please provide the Follower Id', 404));
    
    // 2) filter out unwanted fields name
    // const filterBody = filterObj(req.body, 'following', 'follower');
    const followerObj = await User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user.id }}, {
        new: true,
        runValidators : true,
    });
    
    if(!followerObj) return next(new AppError('Please specify the correct ID', 404));
        
    const updatedFollow =  await User.findByIdAndUpdate( req.user.id, {
        $push:{ following: req.body.followId }}, 
        {
            new: true,
            runValidators : true,
        });
    
    //send back the Status
    res.status(200).json({
        status: "success",
        data:{
            user: updatedFollow,
        }
    });
});

exports.removefollow = catchAsync(async (req,res,next) => {
    // create error if user post password data 
    if(req.body.password || req.body.passwordConfirm) {
        return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
    }
    
    if(!req.body.unfollowId) return next(new AppError('Please provide the Follower Id', 404));
    
    // 2) filter out unwanted fields name
    // const filterBody = filterObj(req.body, 'following', 'follower');
    const followerObj = await User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user.id }}, {
        new: true,
        runValidators : true,
    });
    
    if(!followerObj) return next(new AppError('Please specify the correct ID', 404));
        
    const updatedFollow =  await User.findByIdAndUpdate( req.user.id, {
        $pull:{ following: req.body.unfollowId }}, 
        {
            new: true,
            runValidators : true,
        });
    
    //send back the Status
    res.status(200).json({
        status: "success",
        data:{
            user: updatedFollow,
        }
    });
});



exports.getAllUsers = catchAsync(async(req,res, next)=>{
    //Execute the Query
    const features = new APIFeatures(User.find(),req.query).filter().sort().limitFiels().paginate();
    
    const user = await features.query;
    res.status(200).json({ 
        status: "success",
        result: user.length,
        data:{
            user,
        }
    });
});




exports.getUser = catchAsync(async (req,res, next)=>{

    const user = await User.findById(req.params.id);
    if(!user) return next(new AppError('No Such User Found', 404));
    res.status(200).json({ 
        status: "success",
        data:{
            user,
        }
    });
});
exports.createUser = catchAsync(async (req,res, next) => {
    // const newUser = await User.create(req.body);
    res.status(403).json({
        status: 'error',
        Message: 'Please Use Sign up register User'
    });
});

//Do Not Update Password with this
exports.updateUser = catchAsync(async (req,res, next)=>{
    
    //to return new doc we set new: true
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
    });
    if(!user) return next(new AppError('No Such User Found', 404));
    
    res.status(200).json({ 
        status: "success",
        data:{
            user,
        }
    });
});
exports.deleteUser = catchAsync(async(req, res, next) => {
    
    const doc = await User.findByIdAndDelete(req.params.id);
    
    if(!doc) return next(new AppError('No Such User Found with That ID', 404));
    res.status(204).json({
        status: "Success",
        data: null,
    });
});