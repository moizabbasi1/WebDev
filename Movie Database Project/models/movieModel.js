const mongoose = require('mongoose');
//for adding Slugs 
const slugify = require('slugify');
const People = require('./peopleModel');

const movieSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true, 'A Movie must hai title'],
            unique: [true, 'title should be unique'],
            trim: true,
            maxlength: [30, 'A movie must have less or equal 30 characters'],
            // minlength: [5, 'A movie must have Greater or equal 5 characters']
        },
        slug: String,
        year:{
            type: Number
        },
        rated: {
            type: String
        },
        released:{
            type: Date
        },
        runtime:{
            type: Number,
            required: [true, 'A Movie must have a Runtime']
        },
        director: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'People',
            }
        ],
        genre: {
            type: [String],
            required: [true, 'A Movie Must have a Genre'],
            // unique: true,
        },
        writer: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'People',
            }
        ],
        actors: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'People',
            }
        ],
        plot:{
            type: String,
            required: [true, 'A movie must have a Plot'],
            //remove all the white space
            trim: true,
        },
        Summary:{
            type: String,
            //remove all the white space
            trim: true,
        },
        language:{
            type: [String],
            required: [true, 'A movie must have a Language'],
        },
        country:{
            type: [String],
            required: [true, 'A movie must have a Country'],
        },
        awards:{
            type: String,
        },
        poster:{
            type: String,
            required:[true,'A Movie must have a Cover Image'],
        },
        metascore:{
            type: String,
        },
        imdbRating:{
            type: Number,
            required:[true,'A Movie must have a Imdb Rating'],
        },
        imdbVotes: {
            type: Number,
            // required:[true,'A Movie must have a Imdb Votes'],
        },
        imdbID: {
            type: String,
            // required:[true,'A Movie must have a Imdb ID'],
        },
        type: {
            type: String,
            required:[true,'A Movie must have a Type'],
        },
        DVD: {
            type: Date,
        },
        boxOffice: {
            type: String,
            default: 'N/A'
        },
        productions: {
            type: String,
            default: 'N/A'
        },
        website: {
            type: String,
            default: 'N/A'
        },
        ratingAverage:{
            type: Number,
            default: 7.5,
            min: [1, 'Movie Rating must be above than 1.0'],
            max: [10, 'Movie rating must be less than 10.0']
        },
        ratingQuantity:{
            type: Number,
            default: 7.5,
        },
        createdAt:{
            type: Date,
            default: Date.now(),
            select:false,
        },
        response: {
            type: Boolean,
            default: true
        },
        reviews: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'Review',
            }
        ],
    },
    {
        toJSON: { virtuals: true},
        toObject: { virtuals: true},
    });

//virtual Populating the Reviews into the Movies
movieSchema.virtual('reviews1', {
    ref: 'Review',
    foreignField: 'movie',
    localField: '_id'
});


//Document Middleware
movieSchema.pre('save',function(next) {
    this.slug = slugify( this.title, { lower: true});
    next();
});

//Query Middleware
movieSchema.pre(/^find/, function(next){
    // this.populate({
    //     path: 'director',
    //     fields: 'name -_id'
    // });
    // .populate({
    //     path: 'writer',
    //     select: 'name -_id'
    // }).populate({
    //     path: 'actors',
    //     select: 'name -_id'
    // });
    // this.populate({
    //     path: 'reviews',
    //     select: 'review'
    // });
    
    next();
});

movieSchema.pre(/^find/,function(next) {
    this.find({ response: {$ne: false}});
    next();
});

//Aggregation Middleware
movieSchema.pre('aggregate',function(next) {
    this.pipeline().unshift({ $match: { response: { $ne: false } } });
    // console.log(this.pipeline());
    next();
});


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
