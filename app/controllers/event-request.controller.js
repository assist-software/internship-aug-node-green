const db = require('../models');

const { body, validationResult } = require('express-validator');

const EventRequest = db.EventRequest;
const EventMember = db.EventMember;

const Event = db.Event;
const User = db.User;


//create a new event-request
exports.create = async (req, res) => {

    try {
        const eventResult = await Event.findOne({
            where: {
                id: req.body.eventId
            }
        });
        const userResult = await User.findOne({
            where: {
                id: req.body.userId
            }
        });
        if (eventResult === null || userResult === null) {
            res.status(404).json();
            return;
        }
        else {
            //check membership
            const userMember = await EventMember.findOne({
                where: {
                    userId: req.body.userId,
                    eventId: req.body.eventId
                }
            });
            if (userMember) {
                res.status(500).json({ message: 'Already member! ' });
            }
            else {
                EventRequest.create({
                    userId: req.body.userId,
                    eventId: req.body.eventId
                })
                    .then(data => {
                        res.status(200).json(data);
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message });
                    });
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// accept a request and create a event member
exports.accept = async (req, res, next) => {

    try {
        const id = req.params.requestId;
        const resultEvent = await EventRequest.findOne({
            where: {
                id: id
            }
        });

        if (resultEvent === null) {
            res.status(404).json({ message: 'Event-request nor found!!' });
        }
        else {
            req.body.eventId = resultEvent.eventId;
            req.body.userId = resultEvent.userId;
            next();
            EventRequest.sync().then(
                EventRequest.destroy({
                    where: {
                        id: id
                    }
                })
            );
        }

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//decline request
exports.decline = (req, res) => {
    EventRequest.destroy({
        where: {
            id: req.params.requestId
        }
    })
        .then(num => {
            if (num === 1) {
                res.status(200).json();
            }
            else {
                res.status(404).json();
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        })
};
// get a list of evet-request by eventId
exports.list = (req, res) => {
    EventRequest.findAll({
        where: {
            eventId: req.params.eventId
        }
    })
        .then(requests => {
            res.status(200).json(requests);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        })
};





exports.validationRules = method => {

    switch (method) {
        case 'create': {
            return [
                body(['userId', 'eventId']).exists().isInt().custom((value, { req }) => {
                    return EventRequest.findOne({
                        where: {
                            userId: req.body.userId,
                            eventId: req.body.eventId
                        }
                    })
                        .then(data => {
                            if (data) {
                                throw new Error('Already exists!');
                            }
                        });
                })
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