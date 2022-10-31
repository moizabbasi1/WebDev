const express = require('express');
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const { route } = require('./userRoutes');

const router = express.Router();

// POST /movie/23ewdsz34se3/reviews
// GET /movie/23ewdsz34se3/reviews
router.use('/:movieId/reviews', reviewRouter);


router.route('/top-feature-movies').get(movieController.aliasTopfeatured, movieController.getAllMovies);
router.route('/top-popular-movies').get(movieController.aliasTopPopular, movieController.getAllMovies);
router.route('/similar-movie').get(movieController.similarMovie);
router.route('/movies-stat').get(authController.protect, authController.restrictTo('admin', 'contributor'), movieController.getMoviesStat);

router.route('/')
.get(movieController.getAllMovies)
.post(authController.protect, authController.restrictTo('admin', 'contributor'), movieController.createMovie);

router.route('/:id').get(movieController.getMovie).patch(authController.protect, authController.restrictTo('admin', 'contributor'), movieController.updateMovie).delete(authController.protect, authController.restrictTo('admin', 'contributor'), movieController.deleteMovie);

module.exports = router;