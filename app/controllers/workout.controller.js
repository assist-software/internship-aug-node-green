const db = require('../models');

const {body,validationResult} = require('express-validator');

const Workout = db.Workout;

//create

exports.create = (req, res) => {
    //validate request
    const { duration, heart_rate, calories, avg_speed, distance, workout_effectiveness, userId, eventId } = req.body;

    Workout.create({
        duration,
        heart_rate,
        calories,
        avg_speed,
        distance,
        workout_effectiveness,
        userId,
        eventId
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({error: err.message});
    })
};

//update workout

exports.update = (req, res) => {
    //Validate request
    const id = req.params.workoutId;
    Workout.update(req.body,{
        where: {
            id: id
        }
    })
    .then(num => {
        if(num == 1){
            res.status(200).send();
        } else {
            res.status(404).send({ error: 'Workout not found!!'});
        }
    })
    .catch(err => {
        res.status(500).send({ errors: err.message });
    });
};

//get workout by id
exports.get = (req, res) => {
    const id = req.params.workoutId;

    Workout.findByPk(id)
        .then(workout => {
            if(workout){
                res.status(200).send(workout);
            } else {
                res.status(404).send();
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message});
        });
}

// delete workout by id

exports.delete = (req, res) => {
    
    const id = req.params.workoutId;

    Workout.destroy({
        where: {
            id: id
        }
    })
    .then(num => {
        if(num === 1) {
            res.status(200).send();
        }
        else {
            res.status(404).send();
        }
    })
    .catch(err => {
        res.status(500).json(err.message);
    })
};


exports.search = (req, res) => {

    Workout.findAll()
        .then(workouts => {
            const newWorkouts = workouts.filter(workout => {
                return Object.keys(req.body).every(key => workout[key] === req.body[key]);
            });
            res.status(200).json(newWorkouts);
        })
        .catch(err =>{
            res.status(500).json(err);
        })
}


exports.validationRules = method => {

    switch(method) {
        case 'create' : {
            return [
                body(['duration','heart_rate','calories','avg_speed','distance']).exists().notEmpty().isFloat(),
                body('workout_effectiveness').exists().isString().notEmpty(),
                body(['userId','eventId']).exists().isInt()
            ]
            break;
        }
        case 'updateAndSearch' : {
            return [
                body(['duration','heart_rate','calories','avg_speed','distance']).optional().notEmpty().isFloat(),
                body('workout_effectiveness').optional().isString().notEmpty(),
                body(['userId','eventId']).optional().isInt()
            ]
            break;
        }
    }
};


exports.validate = (req, res, next) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(422).json({ errors: errors.array() });
        return;
    }
    next();
    return ;
}