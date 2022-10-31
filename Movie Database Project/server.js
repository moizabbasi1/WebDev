const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
// For synchoronous code
process.on('uncaughtException', err=>{
    console.log('UNCAUGHT EXCEPTION ! Shutting down....');
    console.log(err);
    process.exit(1);
});

const app = require('./app');

//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

    // for connecting to the atlas cluster
// mongoose.connect(DB,{
    // for local Host connection
mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB Connected succesfuly'));


const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
});

//For Cathing the DB related Errors like Uncaught Rejections
// Basically all the errors related to asynchronous will be caught
process.on('unhandledRejection', err=>{
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTIONS ! Shutting down....');
    server.close(()=>{
        process.exit(1);
    });
});

