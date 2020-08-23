module.exports = app => {
    const auth = require('../config/passport.config')();
    const roleAuth = require('../middlewares/authJwt');
    app.use(auth.initialize());
    const workouts = require('../controllers/workout.controller.js');

    const router = require('express').Router();

    router.post('/create', auth.authenticate(), roleAuth.isAthlete, workouts.validationRules('create'),workouts.validate,workouts.create);

    router.put('/:workoutId',auth.authenticate(),roleAuth.isAthlete, workouts.validationRules('update'),workouts.validate,workouts.update);

    router.get('/:workoutId',auth.authenticate(),workouts.validationRules('verifyWorkoutId'),workouts.validate, workouts.get);

    router.post('/search',auth.authenticate(),workouts.validationRules('search'),workouts.validate, workouts.search);

    router.delete('/:workoutId',auth.authenticate(), workouts.validationRules('verifyWorkoutId'),workouts.validate,workouts.delete);


    router.get('/search/:eventId',auth.authenticate(),workouts.findWorkoutsByEventId);

    app.use('/api/workout',router);
};