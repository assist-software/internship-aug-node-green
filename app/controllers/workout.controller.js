const db = require('../models');

const { body,param, validationResult } = require('express-validator');

const Workout = db.Workout;
const Event = db.Event;

//create

exports.create = async (req, res) => {


    try {
        const eventExists = await Event.findOne({
            where: {
                id: req.body.eventId
            }
        });
        const workoutExists = await Workout.findOne({
            where: {
                userId: req.body.userId,
                eventId: req.body.eventId
            }
        });
        if (!eventExists) {
            res.status(404).json();
        }
        if (workoutExists) {
            throw new Error('Already Exists!');
        }
        const { duration, heart_rate, calories, avg_speed, distance, workout_effectiveness, userId, eventId } = req.body;

        const workout = await Workout.create({
            duration,
            heart_rate,
            calories,
            avg_speed,
            distance,
            workout_effectiveness,
            userId,
            eventId
        });
        res.status(200).json(workout);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

//update workout

exports.update = async (req, res) => {
    try {
        const id = req.params.workoutId;
        //check if workout exists
        const workout = await Workout.findOne({
            where: {
                id: id
            }
        });
        if (!workout) {
            res.status(404).json();
            return;
        }
        if (req.body.eventId) {
            const eventExists = await Event.findOne({
                where: {
                    id: req.body.eventId
                }
            });

            if (!eventExists) {
                throw new Error('Event does not exists');
            }
        }
        //update curent instance
        Object.keys(req.body).forEach(value => workout[value] = req.body[value]);
        workout.save();
        res.status(200).json(workout);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

//get workout by id
exports.get = async (req, res) => {
    try {
        const id = req.params.workoutId;
        const workout = await Workout.findOne({
            where: {
                id: id
            }
        });
        if (workout) {
            res.status(200).json(workout);
        }
        else {
            res.status(404).json();
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
}

// delete workout by id

exports.delete = async (req, res) => {

    try {
        const id = req.params.workoutId;
        const workout = await Workout.findOne({
            where: {
                id: id
            }
        });

        if (workout) {
            workout.destroy();
            res.status(200).json();
        }
        else {
            res.status(404).json();
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.search = async (req, res) => {
    const acceptedFields = ['duration','heart_rate','calories','avg_speed','distance','workout_effectiveness','userId','eventId'];
    const workouts = await Workout.findAll();
    const newWorkouts = workouts.filter(workout => {
        return Object.keys(req.body).filter(keyValue => acceptedFields.includes(keyValue)).every(key => workout[key] === req.body[key]);
    });
    res.status(200).json(newWorkouts);
}


exports.validationRules = method => {

    switch (method) {
        case 'create': {
            return [
                body(['duration', 'heart_rate', 'calories', 'avg_speed', 'distance']).exists().notEmpty().isFloat(),
                body('workout_effectiveness').exists().isString().notEmpty(),
                body(['userId', 'eventId']).exists().isInt()
            ]
            break;
        }
        case 'update': {
            return [
                body(['duration', 'heart_rate', 'calories', 'avg_speed', 'distance']).optional().notEmpty().isFloat(),
                body('workout_effectiveness').optional().isString().notEmpty(),
                body(['userId', 'eventId']).optional().isInt(),
                param('workoutId').exists().isInt()
            ]
            break;
        }
        case 'search': {
            return [
                body(['duration', 'heart_rate', 'calories', 'avg_speed', 'distance']).optional().notEmpty().isFloat(),
                body('workout_effectiveness').optional().isString().notEmpty(),
                body(['userId', 'eventId']).optional().isInt()
            ]
            break;
        }

        case 'verifyWorkoutId': {
            return [
                param('workoutId').exists().isInt()
            ]
            break;
        }
    }
};


exports.validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    next();
    return;
}