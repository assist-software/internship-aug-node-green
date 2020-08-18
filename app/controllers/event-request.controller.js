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
            const eventExists = await EventRequest.findOne({
                where: {
                    userId: userResult.id,
                    eventId: eventResult.id
                }
            });
            if (eventExists) {
                throw new Error('Request exists!!');
            }
            //check membership
            const userMember = await EventMember.findOne({
                where: {
                    userId: req.body.userId,
                    eventId: req.body.eventId
                }
            });
            if (userMember) {
                throw new Error('Already member!');
            }
            else {
                EventRequest.create({
                    userId: req.body.userId,
                    eventId: req.body.eventId
                });
                res.status(200).json();
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
            res.status(404).json();
            return;
        }
        else {
            req.body.eventId = resultEvent.eventId;
            req.body.userId = resultEvent.userId;
            next();

            EventRequest.destroy({
                where: {
                    id: id
                }
            });
            res.status(200).json();

        }

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


//decline request
exports.decline = async (req, res) => {
    try {
        const id = req.params.requestId;
        const requestResult = await EventRequest.findOne({
            where: {
                id: id
            }
        });
        if (requestResult) {
            EventRequest.destroy({
                where: {
                    id: requestResult.id
                }
            });
            res.status(200).json();
        }
        else {
            res.status(404).json();
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// get a list of evet-request by eventId
exports.list = async (req, res) => {
    try {
        const data = await EventRequest.findAll({
            where: {
                eventId: req.params.eventId
            }
        });
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};





exports.validationRules = method => {

    switch (method) {
        case 'create': {
            return [
                body(['userId', 'eventId']).exists().isInt()
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