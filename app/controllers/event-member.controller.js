const db = require('../models');

const { body,param, validationResult } = require('express-validator');

const Event = db.Event;
const User = db.User;
const EventMember = db.EventMember;

//create a member

exports.create = async (req, res) => {
    try {
        //check if event exists
        const eventResult = await Event.findOne({
            where: {
                id: req.body.eventId
            }
        });
        //check if user exists
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
            //check if member exists
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
                //create new member
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
        //check if member exists
        const eventMember = await EventMember.findOne({
            where: {
                id: req.params.memberId
            }
        });
        if(eventMember === null){
            res.status(404).json();
        }
        else {
            //delete member
            eventMember.destroy();
            res.status(200).json();
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get a list of members for an event
exports.list = async (req, res) => {
    //get all members with eventId
    const data = await EventMember.findAll({
        where: {
            eventId: req.params.eventId
        },
        include: {
            model: User,
            attributes: ['id','first_name']
        }
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
        case 'get': {
            return [
                param('eventId').isInt()
            ]
            break;
        }
        case 'delete': {
            return [
                param('memberId').isInt()
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
};