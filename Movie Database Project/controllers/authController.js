// use built-in promisify in order to promisify the jwt.verify
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');
const sendEmail = require('./../Utils/email');



const signToken = id => {
    //jwt.sign() create a token 
    // 1st payload argument is the object data which is going to include in our jwt
    // 2nd Secret string argument which is used in token generating token
    // 3rd option for security measures
    return jwt.sign({ id: id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup =catchAsync(async(req, res, next) =>{
    const newUser = await User.create({
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    
    const token = signToken(newUser._id);
    
    //sending jwt into cookie
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60* 60 * 1000),
        // setting the Http true method so that browser dont update the cookiw in any way
        httpOnly: true,
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    newUser.password = undefined;
    
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

exports.addUserWithoutToken =catchAsync(async(req, res, next) =>{
    const newUser = await User.create({
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        DOB: req.body.DOB,
        city: req.body.city,
        country: req.body.country,
        about: req.body.about,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    
    newUser.password = undefined;
    
    res.status(201).json({
        status: 'success',
        data: {
        }
    });
});

exports.login = catchAsync(async(req, res, next) =>{
    const { email, password } = req.body;
    
    // 1) check email and password actually exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) check user exist && password is correct
    const user = await User.findOne({email: email}).select('+password');
    
    if(!user || !(await user.corectPassword(password, user.password))) 
        return next(new AppError('Incorrect email or password.', 401));
    
    // 3) if every thing ok send token back to client
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60* 60 * 1000),
        // setting the Http true method so that browser dont update the cookiw in any way
        httpOnly: true,
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    
    user.password = undefined;
    res.status(201).json({
        status: 'success',
        token,
    });
});

exports.logout = catchAsync(async(req, res, next) =>{
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    
    res.status(200).json({ status: 'success' });
});

exports.protect = catchAsync(async(req, res, next) =>{
    
    let token;
    
    // 1) getting token check if it's there 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    // console.log(token);
    if(!token) return next(new AppError('You are not logged in. Please login to get Access',401));
    // 2) verification token 
    //promisify(jwt.verify) => function that will call return a promise
    // then again call this (token, process.env.JWT_SECRET); which will also return promise
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // 3) check if user still exist 
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('The user Belong to this does not exist', 401));
    
    // 4) check if user changes password after token isseud
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User Recently Changes the password! Please log in again.', 401));
    }
    
    //Grant Acces to the Protexted Route
    res.locals.user = currentUser;
    req.user = currentUser;
    next();
});


//only for render pages, no errors
exports.isLoggedIn = async(req, res, next) =>{
    // 1) getting token check if it's there 
    if(req.cookies.jwt){
        
        try{
            // 2) verification token 
            //promisify(jwt.verify) => function that will call return a promise
            // then again call this (token, process.env.JWT_SECRET); which will also return promise
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // console.log(decoded);
            
            // 3) check if user still exist 
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) return next();
            
            // 4) check if user changes password after token isseud
            if(currentUser.changedPasswordAfter(decoded.iat)){
                return next();
            }
            
            //There is a logged in user
            res.locals.user = currentUser;
            return next();
        }catch{
            return next();
        }
    }
    next();
};

exports.restrictTo = (...roles)=>{
    return (req, res, next) =>{
        // check for the roles either this is in the array or not
        if(!roles.includes(req.user.role)){
            // status code 403 for Unauthorized
            return next(new AppError('You do not have permission to perform this Action', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async(req, res, next) =>{
    // 1) Get user based on Posted Emial 
    const user = await User.findOne({ email: req.body.email });
    
    if(!user){ 
        return next(new AppError('No User with that Email', 404)); 
    }
    
    // 2) Generate the random email signToken
    const resetToken = user.createPasswordResetToken();
    
    // we have updated the document so need to save it
    // {validateBeforeSave: false} will deactivate all the validate the specified in our Schema
    await user.save({ validateBeforeSave: false });
    
    // 3) send it to the User Email
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
    
    
    const message = `Forgot your Password! submit a new PATCH req with NEW Password and Password confirm to : ${resetURL}.\n if you dindt make that request plzz ignore`;
    
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password Reset Token(valid for 10 minute)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to the email',
        });
    }
    catch{
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try that later!', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) =>{
    
    // 1) Get User based on the Token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne(
        {
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt : Date.now()}
    });
    console.log(user);
    // 2) If token has not expired and there is a User , set the new Password
    //status code 400 for bad request
    if(!user){ return next(new AppError('Token is Invalid or has Expired', 400)); }
    
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // 3) Update the changedPasswordAt property for that User
    
    // 4) log the User in Send jwt
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60* 60 * 1000),
        // setting the Http true method so that browser dont update the cookiw in any way
        httpOnly: true,
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    
    user.password = undefined;
    
    res.status(201).json({
        status: 'success',
        token,
    });
});

exports.updatePassword = catchAsync(async(req,res, next)=>{
    
    // 1) get User from colection
    const user = await User.findById(req.user.id).select('+password');
    
    // 2) check if Posted Current password is correct
    if(!(await user.corectPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your Current password is wrong!', 401));
    }
    // 3) if so, Update Password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    
    // 4) send Token log in the User
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60* 60 * 1000),
        // setting the Http true method so that browser dont update the cookiw in any way
        httpOnly: true,
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);
    
    user.password = undefined;
    res.status(201).json({
        status: 'success',
        token,
    });
    
});


