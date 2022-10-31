const AppError = require('./../Utils/appError');


const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  
const handleDuplicateErrorDB = (err) => {
//spliting the string between ""and selecting the text within ""
// Using Regular Expression
const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];

const message = `Duplicate field value: ${value}. Please use another value`;
return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
//   console.log('err', err);
//extracting the err.errors array Object and then loop through it for getting its messages
const errors = Object.values(err.errors).map((el) => el.message);
//   console.log(errors);
const message = `Invalid Input data. ${errors.join('. ')}`;
return new AppError(message, 404);
};
  
const handleJsonWebTokenError = () =>
new AppError('Invalid Token. Please Login Agian', 401);

const handleTokenExpiredError = () =>
new AppError('your Token Has Expired. Please Log in again!', 401);

const sendDevError = (err, req, res)=>{
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }else{
        console.log('ERROR!', err);
        res.status(err.statusCode).render('error',{
            title: 'Something went wrong',
            msg: err.message
        });
    }
}

const sendProdError = (err, req, res)=>{
    
    //API
    if(req.originalUrl.startsWith('/api')){
    
        //For Application Errors
        if(err.isOperational){
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }else{
            // programing and other error dont wanna leak details to the Client 
            // 1) console log
            console.log('ERROR!', err);
            // 2) send generi message 
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong. please try later!'
            });
        }
    }else{
        //RENDERING WEBSITES
        if(err.isOperational){
            res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: err.message
            });
        }else{
            // programing and other error dont wanna leak details to the Client 
            // 1) console log
            console.log('ERROR!', err);
            // 2) send generi message 
            res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: 'Please Try again later'
            });
        }
    }
}

module.exports = (err,req,res,next) => {
    console.log(err.stack);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendDevError(err, req, res);
    }else if(process.env.NODE_ENV === 'production'){
        
    //hard copying the err and save it into Error
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;
    //for Invalid ID
    if (err.name === 'CastError') error = handleCastErrorDB(error);

    //for Duplicate Fields
    if (error.code === 11000) error = handleDuplicateErrorDB(err);

    //for Updating Tour
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    //for invalid jsonwebtoken
    if (err.name === 'JosnWebTokenError') error = handleJsonWebTokenError();

    //for Expired Json token
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendProdError(error, req, res);
    
    }
    next();
}











// // eslint-disable-next-line import/no-useless-path-segments
// const AppError = require('./../Utils/appError');
// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
//   //   return new AppError(message, 400);;
// };

// const handleDuplicateErrorDB = (err) => {
//   //spliting the string between ""and selecting the text within ""
//   const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
//   //   console.log(`value: ${value}`);
//   const message = `Duplicate field value: ${value}. Please use another value`;
//   return new AppError(message, 404);
// };

// const handleValidationErrorDB = (err) => {
//   //   console.log('err', err);
//   //extracting the err.errors array and then loop through it for getting its messages
//   const errors = Object.values(err.errors).map((el) => el.message);
//   //   console.log(errors);
//   const message = `Invalid Input data. ${errors.join('. ')}`;
//   return new AppError(message, 404);
// };
// const handleJsonWebTokenError = () =>
//   new AppError('Invalid Token. Please Login Agian', 401);
// const handleTokenExpiredError = () =>
//   new AppError('your Token Has Expired. Please Log in again!', 401);
// const sendErrorDev = (err, req, res) => {
//   // if the url start with api then it would in postman
//   //A) API
//   if (req.originalUrl.startsWith('/api')) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack,
//     });
//   }
//   //B) RENDER WEBSITES
//   return res.status(err.statusCode).render('error', {
//     title: 'Something Went wrong!',
//     msg: err.message,
//   });
// };
// const sendErrorProd = (err, req, res) => {
//   //A) API
//   if (req.originalUrl.startsWith('/api')) {
//     //operational, trusted err: send message to the Client
//     //   console.log('prod error: ', err.status, err.message, err.isOperational);
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//       //programming or other Unknown error : Dont wanna Leak fetails to Client
//     }
//     // For Non Operational Error like error server
//     //1) log Error
//     console.error('ERROR!, ', err);
//     //2) send generic res
//     return res.status(500).json({
//       status: 'error',
//       message: 'something went Wrong',
//     });
//   }
//   //B) RENDER WEBSITE
//   //operational, trusted err: send message to the Client
//   //   console.log('prod error: ', err.status, err.message, err.isOperational);
//   if (err.isOperational) {
//     return res.status(err.statusCode).render('error', {
//       title: 'Something went wrong',
//       msg: err.message,
//     });
//     //programming or other Unknown error : Dont wanna Leak fetails to Client
//   }
//   // For Non Operational Error like error server
//   //1) log Error
//   console.error('ERROR!, ', err);
//   //2) send generic res
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong',
//     msg: 'Please Try Later!',
//   });
// };
// module.exports = (err, req, res, next) => {
//   // console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   console.log('res err');
//   //in order to get maximum imfo about the error for the developer
//   if (process.env.NODE_ENV === 'development') {
//     console.log('dev err');
//     sendErrorDev(err, req, res);
//     //in order to get manimum imfo passing the error to the Client
//   } else if (process.env.NODE_ENV === 'production') {
//     console.log('prod err');
//     //hard copying the err and save it into Error
//     // eslint-disable-next-line node/no-unsupported-features/es-syntax
//     let error = { ...err };
//     error.message = err.message;
//     //for Invalid ID
//     if (err.name === 'CastError') error = handleCastErrorDB(error);
//     //for Duplicate Fields
//     if (error.code === 11000) error = handleDuplicateErrorDB(err);
//     //for Updating Tour
//     if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
//     //for invalid jsonwebtoken
//     if (err.name === 'JosnWebTokenError') error = handleJsonWebTokenError();
//     //for Expired Json token
//     if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
//     sendErrorProd(error, req, res);
//   }
//   // next();
// };
