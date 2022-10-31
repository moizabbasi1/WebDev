
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// for http prevention
// const helmet = require('helmet');

const AppError = require('./Utils/appError');
const globalError = require('./controllers/errorController');
const movieRouter = require('./routes/moiveRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const peopleRouter = require('./routes/peopleRoutes');
const viewRouter = require('./routes/viewRoutes');


// kind of strandard
const app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
// 1)MiddleWare

// use morgan for logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'Public')));

//data form the body added to the req object by using the below middleware
app.use(express.json());
// to get data from the url encoded
app.use(express.urlencoded({ extended: true }));
//Parses the from the cookie
app.use(cookieParser());

const corsOptions = {
    origin: ['http://localhost'],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}

app.use(cors(corsOptions));

app.options('*', cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header('Access-Control-Allow-Methods', 'PATCH, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
});

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
});


//Mounting the defined Router on a route
app.use('/',viewRouter);
app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/peoples', peopleRouter);



app.all('*', (req,res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});


app.use(globalError);

module.exports = app;
