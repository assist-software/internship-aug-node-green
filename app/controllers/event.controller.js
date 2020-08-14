const db = require('../models/index');
const { body, validationResult } = require('express-validator');
const Clubs = db.Club;
const Events = db.Event;

exports.create = (req, res) => {
    
    Clubs.findOne({
        where: {
            id: req.body.clubId
        }
    })
    .then((club) => {
        if(!club) {
            res.status(404).send({message: "club not found"});
        }
        Events.sync().then(() => {
            Events.create({
                club_id: req.body.clubId,
                name: req.body.name,
                date: req.body.date,
                time: req.body.time,
                description: req.body.description,
                location: req.body.location,
                radius: req.body.radius,
                sport_id: req.body.sportId,
                event_cover: req.body.eventCover
            })
        })
        .then(event => res.send({message: "event created"}))
        .catch(err => res.send({err: err}));
        
    })
    .catch((err) => {
        res.send({err: err.message});
    });
}

exports.search = (req, res) => {
    
}

exports.get = (req, res) => {
    Events.findOne({
        where: {
            id: req.params.eventId
        }
    })
    .then(event => {
        if(!event) {
            res.status(404).send({ message: "Event ID not found"});
        }

        res.status(200).send(event);
    })
    .catch(err => res.send({err: err.message}));
}

exports.update = (req, res) => {

}

exports.delete = (req, res) => {
    Events.findOne({
        where: {
            id: req.params.eventId
        }
    })
    .then(event => {
        if(!event) {
            res.status(404).send({ message: "Event ID not found"});
        }
        Events.sync().then(() => {
            Events.destroy({
                where: {
                    id: req.params.eventId
                }
            })
        })
        .catch(err => res.send({err: err.message}));
        res.status(200).send({message: "Event deleted succesful"});
    })
    .catch(err => res.send({err: err.message}));
}

// Validation Rules
exports.createValidator = () => {
    return [
        body('clubId', 'Invalid ID').exists().isInt().withMessage('ID must be integer'),
        body('name', 'Inavlid name').exists().isLength({min: 5}).withMessage('Too short name'),
        body('date', 'Invalid date format').exists(),
        body('time').exists(),
        body('description', 'Invalid description').exists().isString(),
        body('location', 'Invalid location').exists().isString(),
        body('radius', 'Invalid radius').exists().isInt(), 
        body('sportId', 'Invalid sport type id').exists().isInt()  
        //body('event_cover').exists()  
    ]
  }
  
exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(422).json({
      errors: extractedErrors,
    })
  }