const db = require('../models');

const { body, validationResult } = require('express-validator');

const Event = db.Event;
const User = db.User;
const EventMember = db.EventMember;

//create a member

exports.create = async (req, res, next) => {
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
            //check if exists
            const userExists = await EventMember.findOne({
                where: {
                    userId: req.body.userId,
                    eventId: req.body.eventId
                }
            });
            if (userExists) {
                res.status(500).json({ message: 'Already member !' });
                return;
            }
            else {
                EventMember.create({
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

// delete a member by id
exports.remove = async (req, res) => {
    try {
        const eventMember = await EventMember.findOne({
            where: {
                id: req.params.inviteId
            }
        });
        if(eventMember === null){
            res.status(404).json();
        }
        else {
            EventMember.destroy({
                where: {
                    id: eventMember.id
                }
            });
            res.status(200).json();
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get a list of members for an event
exports.list = (req, res) => {

    EventMember.findAll({
        where: {
            eventId: req.params.eventId
        },
        attributes: ['userId']
    })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
}




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
    else {
        next();
        return;
    }
}