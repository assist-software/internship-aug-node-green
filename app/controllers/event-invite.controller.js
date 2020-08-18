const db = require('../models');

const { body, validationResult } = require('express-validator');

const EventInvite = db.EventInvite;
const EventMember = db.EventMember;

const Event = db.Event;
const User = db.User;

//create new event-invite
exports.create = async (req, res) => {

    try {
        const eventResult = await Event.findOne({
            where: {
                id: req.body.eventId
            }
        });
        const userResult = await User.findOne({
            where: {
                email: req.body.email
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
                    eventId: req.body.eventId,
                    userId: userResult.id
                }
            });
            if (userMember !== null) {
                throw new Error('Already member');
            }
            else {
                EventInvite.create({
                    email: req.body.email,
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

exports.accept = async (req, res, next) => {


    try {
        const id = req.params.inviteId;
        let email;
        const eventResult = await EventInvite.findOne({
            where: {
                id: id
            }
        });


        if (eventResult === null) {
            res.status(404).json();
            return;
        }
        else {
            req.body.eventId = eventResult.eventId;
            email = eventResult.email;
        }

        const userResult = await User.findOne({
            where: {
                email: email
            }
        });

        if (userResult === null) {
            res.status(404).json({ message: 'Email not found!!!' });
        }
        else {
            req.body.userId = userResult.id;
            next();
            EventInvite.sync().then(
                EventInvite.destroy({
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


//decline event-invite
exports.decline = (req, res) => {
    const id = req.params.inviteId;
    EventInvite.destroy({
        where: {
            id: id
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

//get a list of invites by eventId
exports.list = (req, res) => {
    const id = req.params.eventId;
    EventInvite.findAll({
        where: {
            eventId: id
        }
    })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
};



exports.validationRules = method => {

    switch (method) {
        case 'create': {
            return [
                body('eventId').exists().isInt().custom((value, { req }) => {
                    return EventInvite.findOne({
                        where: {
                            email: req.body.email,
                            eventId: req.body.eventId
                        }
                    })
                        .then(data => {
                            if (data) {
                                throw new Error('Already exists!');
                            }
                        });
                }),
                body('email').exists().isEmail()
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