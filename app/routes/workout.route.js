module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const workouts = require('../controllers/workout.controller.js');

    const router = require('express').Router();

    router.post('/create', auth.authenticate(), workouts.validationRules('create'),workouts.validate,workouts.create);

    router.put('/:workoutId',auth.authenticate(), workouts.validationRules('updateAndSearch'),workouts.validate,workouts.update);

    router.get('/:workoutId',auth.authenticate(), workouts.get);

    router.post('/search',auth.authenticate(), workouts.search);

    router.delete('/:workoutId',auth.authenticate(), workouts.validationRules('updateAndSearch'),workouts.validate,workouts.delete);

    app.use('/api/workout',router);
};