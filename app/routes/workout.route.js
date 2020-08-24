module.exports = app => {
    const auth = require('../config/passport.config')();
    const roleAuth = require('../middlewares/authJwt');
    app.use(auth.initialize());
    const workouts = require('../controllers/workout.controller.js');
    const utils = require('../utils/validate.utils.js');

    const router = require('express').Router();

    router.post('/create', auth.authenticate(), roleAuth.isAthlete, workouts.validationRules('create'),utils.validate,workouts.create);

    router.put('/:workoutId',auth.authenticate(),roleAuth.isAthlete, workouts.validationRules('update'),utils.validate,workouts.update);

    //get an workout by user Id
    router.get('/:workoutId',auth.authenticate(),workouts.validationRules('verifyWorkoutId'),utils.validate, workouts.get);

    router.post('/search',auth.authenticate(),workouts.validationRules('search'),utils.validate, workouts.search);

    router.delete('/:workoutId',auth.authenticate(), workouts.validationRules('verifyWorkoutId'),utils.validate,workouts.delete);


    router.get('/search/:eventId',auth.authenticate(),workouts.findWorkoutsByEventId);

    router.get('/searchEventAndMembers/:eventId',auth.authenticate(),workouts.findWorkoutsByEventIdFront);

    app.use('/api/workout',router);
};