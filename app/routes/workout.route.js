const { route } = require('./auth.routes.js');

module.exports = app => {
    const workouts = require('../controllers/workout.controller.js');

    const router = require('express').Router();

    router.post('/create',workouts.validationRules('create'),workouts.validate,workouts.create);

    router.put('/:workoutId',workouts.validationRules('updateAndSearch'),workouts.validate,workouts.update);

    router.get('/:workoutId',workouts.get);

    router.post('/search',workouts.search);

    router.delete('/:workoutId',workouts.validationRules('updateAndSearch'),workouts.validate,workouts.delete);

    app.use('/api/workout',router);
};