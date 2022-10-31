const AppError = require('../Utils/appError');
const People = require('./../models/peopleModel');
const catchAsync = require('./../Utils/catchAsync');
const APIFeatures = require('./../Utils/apiFeatures');


// exports.getMe = catchAsync(async (req,res, next) => {
//     const user = await User.findById(req.user.id);
//     if(!user) return next(new AppError('No Such User Found', 404));
//     res.status(200).json({ 
//         status: "success",
//         data:{
//             user,
//         }
//     });
// });
// exports.updateMe = catchAsync(async (req,res,next) => {
//     // create error if user post password data 
//     if(req.body.password || req.body.passwordConfirm) {
//         return next(new Error(' this route is not for password Update please use /updateMyPassword for this', 400));
//     }
//     // 2) filter out unwanted fields name
//     const filterBody = filterObj(req.body, 'name', 'email');
//     // 3) update the User 
//     const updatedUser = await User.findByIdAndUpdate( req.user.id, filterBody, {
//         new: true,
//         runValidators : true,
//     });
//     //send back the Status
//     res.status(200).json({
//         status: "success",
//         data:{
//             user: updatedUser,
//         }
//     });
// });
// exports.deleteMe = catchAsync(async (req,res, next) => {
//     await User.findByIdAndUpdate(req.user.id, { active: false});
//     res.status(204).json({
//         status: "success",
//         data: null,
//     });
// });
// const createTag = function(tag) {
//     return db.Tag.create(tag).then(docTag => {
//       console.log("\n>> Created Tag:\n", docTag);
//       return docTag;
//     });
//   };
// const addTagToTutorial = function(tutorialId, tag) {
//     return db.Tutorial.findByIdAndUpdate(
//       tutorialId,
//       { $push: { tags: tag._id } },
//       { new: true, useFindAndModify: false }
//     );
//   };
// const addTutorialToTag = function(tagId, tutorial) {
//     return db.Tag.findByIdAndUpdate(
//       tagId,
//       { $push: { tutorials: tutorial._id } },
//       { new: true, useFindAndModify: false }
//     );
//   };

exports.getAllPeoples = catchAsync(async(req,res, next)=>{
    //Execute the Query
    const features = new APIFeatures(People.find(),req.query).filter().sort().limitFiels().paginate();
    
    const people = await features.query;
    res.status(200).json({ 
        status: "success",
        result: people.length,
        data:{
            people,
        }
    });
});

exports.getPeople = catchAsync(async (req,res, next)=>{

    const people = await People.findById(req.params.id);
    if(!people) return next(new AppError('No Such User Found', 404));
    res.status(200).json({ 
        status: "success",
        data:{
            people,
        }
    });
});
exports.createPeople = catchAsync(async (req,res, next) => {
    const newPeople = await People.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            People: newPeople,
        },
    });
});

//Do Not Update Password with this
exports.updatePeople = catchAsync(async (req,res, next)=>{
    
    //to return new doc we set new: true
    const people = await People.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true,
    });
    if(!people) return next(new AppError('No Such User Found', 404));
    
    res.status(200).json({ 
        status: "success",
        data:{
            people,
        }
    });
});
exports.deletePeople = catchAsync(async(req, res, next) => {
    
    const doc = await People.findByIdAndDelete(req.params.id);
    
    if(!doc) return next(new AppError('No Such User Found with That ID', 404));
    res.status(204).json({
        status: "Success",
        data: null,
    });
});