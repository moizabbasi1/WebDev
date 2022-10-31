const mongoose = require('mongoose');
const validator = require('validator');
const Movie = require('./movieModel');
const slugify = require('slugify');

const peopleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required']
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide a valid Email'],
    },
    photo:{
        type: String,
    },
    slug: String,
    DOB: Date,
    city: String,
    country: String,
    about: String,
    role:{
        type: String,
        enum:['actor','writer', 'director'],
        required: [true, 'people role must be defined']
    },
    roleDescription: {
        type:[String],
        default: "",
    },
    
    active: {
        type: Boolean,
        default : true,
        select: false,
    },
    movie:[
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie',
        },
    ]
});



peopleSchema.pre('save',function(next) {
    this.slug = slugify( this.name, { lower: true});
    next();
});

// peopleSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'movie',
//         select: 'name -_id'
//     });
//     next();
// });



const People = mongoose.model('People', peopleSchema);
module.exports = People;


