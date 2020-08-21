module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const workouts = require('../controllers/workout.controller.js');

    const router = require('express').Router();

    router.post('/create', auth.authenticate(), workouts.validationRules('create'),workouts.validate,workouts.create);

    router.put('/:workoutId',auth.authenticate(), workouts.validationRules('update'),workouts.validate,workouts.update);

    router.get('/:workoutId',auth.authenticate(),workouts.validationRules('verifyWorkoutId'),workouts.validate, workouts.get);

    router.post('/search',auth.authenticate(),workouts.validationRules('search'),workouts.validate, workouts.search);

    router.delete('/:workoutId',auth.authenticate(), workouts.validationRules('verifyWorkoutId'),workouts.validate,workouts.delete);

    app.use('/api/workout',router);
};