// built-in module
// use to create a random string
const crypto = require('crypto');

const slugify = require('slugify');
const mongoose = require('mongoose');
const validator = require('validator');
// use to hash password
// it add random string to our password called salt the password
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
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
        enum:['user','contributor', 'people', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: 8,
        //for not revealing the password to the client
        select: false,
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Password Confirm is required'],
        validate:{
            // only works on create and SAVE
            validator: function(el){
                return el === this.password;
            },
            message: 'Password should be same',
        }

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default : true,
        select: false,
    },
    wishList:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Movie'
        }
    ],
    following: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
        }
    ],
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    reviews: [
        {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
        }
    ]
},
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true},
});


userSchema.virtual('reviews1', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre('save',function(next) {
    this.slug = slugify( this.name, { lower: true});
    next();
});

//comment out this portion to import Database


userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    //we make a little hack here for some to operation time that why we did -
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre('save', async function(next){
    //checking for password modified or not
    if(!this.isModified('password')) return next();
    //Passes current doc and cost of cpu intensive this operation is
    this.password = await bcrypt.hash(this.password, 12);

    //setting the password Confirm to Null
    this.passwordConfirm = undefined;
    next();
});



userSchema.pre(/^find/, function(next){
    //this point to the curent document
    this.find({ active: { $ne: false } });
    next();
});


userSchema.pre(/^find/, function(next){
    // this.populate({
    //     path: 'followers',
    //     select: 'name -_id'
    // });
    // this.populate({
    //     path: 'wishList',
    //     select: 'title -_id'
    // });
    // this.populate({
    //     path: 'reviews',
    //     select: 'title -_id'
    // });

    next();
});

// creating Instance Method
// That is Availiable on all documents of a certain collection
userSchema.methods.corectPassword = async function(canditatePassword, userPassword){
    return await bcrypt.compare(canditatePassword,userPassword);
};
// checking the Passwrod changed after issued the token
userSchema.methods.changedPasswordAfter =  function(JWTTimestamp){

    if(this.passwordChangedAt){
        // convert into milisecond format
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);

        return JWTTimestamp<changedTimestamp;
    }
    // flase means not changed
    return false;
};

userSchema.methods.createPasswordResetToken =  function(){

    //creating random string of 32 characters
    const resetToken = crypto.randomBytes(32).toString('Hex');

    //convert it into hash encripted String and storing it into document for later compare
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('Hex');

    // saving a date too for later use
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);

    return resetToken;
};



const User = mongoose.model('User', userSchema);

module.exports = User;
