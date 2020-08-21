const db = require('../models');

const { body, validationResult } = require('express-validator');

const Event = db.Event;
const User = db.User;
const EventMember = db.EventMember;
const EventRequest = db.EventRequest;
const { Op } = require("sequelize");
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
                throw new Error('Already member !');
            }
            else {
                EventMember.create({
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
exports.list = async (req, res) => {

    const data = await EventMember.findAll({
        where: {
            eventId: req.params.eventId
        },
        attributes: ['userId']
    });
    res.status(200).json(data);
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