const express = require('express');

const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/movie/:slug', authController.isLoggedIn, viewsController.getMovie);

router.get('/users', authController.isLoggedIn, viewsController.getUsers);
router.get('/users/:slug', authController.isLoggedIn, viewsController.getUserProfile);

router.get('/peoples', authController.isLoggedIn, viewsController.getallPeoples)
router.get('/peoples/:slug', authController.isLoggedIn, viewsController.getPeople);

router.get('/login', authController.isLoggedIn,viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getMyself);
router.post('/submit-user-data', authController.protect, viewsController.updataMyData);


router.get('/AddUserForm', authController.protect, authController.restrictTo('admin', 'contributor'),viewsController.getAddUserform);
router.get('/AddMovieForm', authController.protect, authController.restrictTo('admin', 'contributor'),viewsController.getAddMovieform);
router.get('/search', authController.protect, authController.restrictTo('admin', 'contributor'),viewsController.getsearchform);
router.post('/search-data', authController.protect, viewsController.searchData);
router.get('/deleteSearchUser', authController.protect, authController.restrictTo('admin'),viewsController.getDeleteUserform);
router.post('/delete-user', authController.protect, viewsController.deleteUser);

router.get('/deleteSearchMovie', authController.protect, authController.restrictTo('admin'),viewsController.getDeleteMovieform);
router.post('/delete-movie', authController.protect, viewsController.deleteMovie);


module.exports = router;