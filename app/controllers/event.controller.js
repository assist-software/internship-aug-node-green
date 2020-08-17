const db = require('../models/index');
const { body, validationResult } = require('express-validator');
const { sequelize } = require('../models/index');
const Clubs = db.Club;
const Events = db.Event;
const Op = db.Sequelize.Op;
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
    Events.findAll({
        where: {
            name: {
                [Op.iLike]: '%' + req.body.name + '%'
            }
        }
    })
    .then((events) => {
        if(!events) {
            res.status(404).send({ message: "events not found"});
        }
        res.status(200).send({ events: events});
    })
    .catch((err) => {
        res.send({ error: err.message});
    })
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
    Events.findOne({
        where: {
            id: req.params.eventId
        }
    })
    .then(event => {
        if(!event) {
            res.status(404).send({ message: "Event ID not found"});
        }
        event.name = req.body.name,
        event.date = req.body.date,
        event.time = req.body.time,
        event.description = req.body.description,
        event.location = req.body.location,
        event.radius = req.body.radius,
        event.sportId = req.body.sportId,
        event.event_cover = req.body.event_cover
        event.save();
        res.status(200).send({ message: event});
    })
    .catch(err => res.send({err: err.message}));
};   

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
        body('name', 'Inavlid name').exists().isLength({min: 5}).withMessage('Too short name').custom(eventName => {
            return Events.findOne({
                where: {
                    name: eventName
                }
            })
            .then(event => {
                if(event) {
                    throw new Error('Name already in use');
                }
            })
        }),
        body('date', 'Invalid date format').exists(),
        body('time').exists(),
        body('description', 'Invalid description').exists().isString(),
        body('location', 'Invalid location').exists().isString(),
        body('radius', 'Invalid radius').exists().isInt(), 
        body('sportId', 'Invalid sport type id').exists().isInt()  
        //body('event_cover').exists()  
    ]
  }

exports.updateValidator = () => {
    return [
        //body('clubId', 'Invalid ID').exists().isInt().withMessage('ID must be integer'),
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