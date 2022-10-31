const express = require('express');
const peopleController = require('../controllers/peopleController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(peopleController.getAllPeoples).post(authController.protect, authController.restrictTo('admin'), peopleController.createPeople);
router.route('/:id').get(peopleController.getPeople).patch(authController.protect, authController.restrictTo('admin'), peopleController.updatePeople).delete(authController.protect, authController.restrictTo('admin'), peopleController.deletePeople);




module.exports = router;