const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

//const Movie = require('../models/movieModel');
//const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const People = require('../models/peopleModel');






mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB Connected successfully'));


//read Json File
//const movies = JSON.parse(fs.readFileSync(`${__dirname}/movie-data-short.json`, 'utf-8'));
//const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews-data.json`, 'utf-8'));
const peoples = JSON.parse(fs.readFileSync(`${__dirname}/peoples.json`, 'utf-8'));




// import data into DB
const importData = async ()=>{
    try {
        //await Movie.create(movies);
        //await User.create(users, { validateBeforeSave: false });
         await Review.create(reviews);
        await People.create(peoples);
        console.log('data Successfully loaded to the databse');
    } catch (err) {
        console.log('Error loading!',err.status, err.message, err);
    }
    process.exit();
}

//delete data from DB
const deleteData = async ()=>{
    try {
         //await Movie.deleteMany();
         //await User.deleteMany();
         await Review.deleteMany();
        await People.deleteMany();
        console.log('data Successfully deleted from the database');
    } catch (err) {
        console.log('Error deleting!',err);
    }
    process.exit();
}


if(process.argv[2] == '--import'){
    importData();
}
else if(process.argv[2] == '--delete'){
    deleteData();
}
