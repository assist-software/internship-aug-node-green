const db = require('../models/index');
const { body, validationResult } = require('express-validator');
const { sequelize } = require('../models/index');
const Clubs = db.Club;
const Events = db.Event;
const EventMember = db.EventMember;
const EventRequest = db.EventRequest;
const ClubMember = db.ClubMember;
const User = db.User;
const fs = require('fs');
const { fn, col } = db.sequelize;

const Op = db.Sequelize.Op;
exports.create = (req, res) => {

    Clubs.findOne({
        where: {
            id: req.body.clubId
        }
    })
        .then((club) => {
            if (!club) {
                res.status(404).send({ message: "club not found" });
            }
            //set event_cover
            const event_cover = (req.file) ? req.file.path : 'images/no_imageEvent.jpg';
            Events.sync().then(() => {
                Events.create({
                    clubId: req.body.clubId,
                    name: req.body.name,
                    date: req.body.date,
                    time: req.body.time,
                    description: req.body.description,
                    location: req.body.location,
                    radius: req.body.radius,
                    sportId: req.body.sportId,
                    event_cover: event_cover
                })
            })
                .then(event => res.send({ message: "event created" }))
                .catch(err => res.send({ err: err }));

        })
        .catch((err) => {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.send({ err: err.message });
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
            if (!events) {
                res.status(404).send({ message: "events not found" });
            }
            res.status(200).send({ events: events });
        })
        .catch((err) => {
            res.send({ error: err.message });
        })
}

exports.get = (req, res) => {
    Events.findOne({
        where: {
            id: req.params.eventId
        }
    })
        .then(event => {
            if (!event) {
                res.status(404).send({ message: "Event ID not found" });
                return;
            }

            if (event.event_cover) {
                event['event_cover'] = `${req.protocol}://${req.headers.host}/${event.event_cover}`;
            }

            res.status(200).send(event);
        })
        .catch(err => res.send({ err: err.message }));
};

exports.update = async (req, res) => {
    try {
        //check if event exists
        const event = await Events.findOne({
            where: {
                id: req.params.eventId
            }
        });

        if (!event) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).json({ error: 'Event not found!!' });
            return;
        }
        //set event_cover image
        const event_cover = (req.file) ? req.file.path : null;

        if (event_cover !== null) {
            if (event.event_cover && !event.event_cover.includes('no_image')) {
                fs.unlinkSync(event.event_cover);
            }
            event.event_cover = event_cover;
        }
        //update event
        Object.keys(req.body).forEach(value => {
            if (value !== 'event_cover') {
                event[value] = req.body[value];
            }
        });
        event.save();
        res.status(200).json();

    }
    catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({ message: err.message });
    }
};

exports.delete = (req, res) => {
    Events.findOne({
        where: {
            id: req.params.eventId
        }
    })
        .then(event => {
            if (!event) {
                res.status(404).send({ message: "Event ID not found" });
            }
            if (event.event_cover && event.event_cover !== 'images/no_imageEvent.jpg') {
                fs.unlinkSync(event.event_cover);
            }
            Events.sync().then(() => {
                Events.destroy({
                    where: {
                        id: req.params.eventId
                    }
                })
            })
                .catch(err => res.send({ err: err.message }));

            res.status(200).send({ message: "Event deleted succesful" });
        })
        .catch(err => res.send({ err: err.message }));
}
//send to user all events related to him
exports.findAllEventsByUserId = async (req, res) => {
    try {
        const id = req.params.userId;
        const joined = await EventMember.findAll({
            where: {
                userId: id
            },
            include: {
                model: Events,
                attributes: ['id', 'name', 'date', 'location', 'sportId', [fn('CONCAT', `${req.protocol}://${req.headers.host}/`, col('event_cover')), 'event_cover']]
            },
            attributes: ['eventId']

        });

        const pending = await EventRequest.findAll({
            where: {
                userId: id
            },
            include: {
                model: Events,
                attributes: ['id', 'name', 'date', 'location', 'sportId', [fn('CONCAT', `${req.protocol}://${req.headers.host}/`, col('event_cover')), 'event_cover']]
            },
            attributes: ['eventId']
        });

        res.status(200).json({ joined, pending });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//find all events by ClubId and UserId
exports.findEventsByClub = async (req, res) => {
    try {
        const clubs = await ClubMember.findAll({
            where: {
                userId: req.params.userId
            },
            attributes: ['clubId']
        });
        const intClubs = clubs.map(club => club.clubId);
        const eventMember = await EventMember.findAll({
            where: {
                userId: req.params.userId
            }
        });
        const intMembers = eventMember.map(member => member.eventId);
        const eventRequest = await EventRequest.findAll({
            where: {
                userId: req.params.userId
            }
        });
        const intRequest = eventRequest.map(member => member.eventId);
        const nou = intMembers.concat(intRequest);

        const events = await Events.findAll({
            where: {
                id:{
                    [Op.notIn]: nou
                },
                clubId: {
                    [Op.in]: intClubs
                }

            },
            attributes: ['id', 'name', 'date', 'location', [fn('CONCAT', `${req.protocol}://${req.headers.host}/`, col('event_cover')), 'event_cover'], 'sportId']
        });


        //const members = events.filter(event => !intMembers.includes(event.userId) && !intRequest.includes(event.userId));

        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

};

exports.findAllEventsWithMembers = async (req, res) => {
    try {
        const finalList = [];
        const events = await Events.findAll({
            attributes: ['id', 'name', 'date', 'time', 'description', 'location', [fn('CONCAT', `${req.protocol}://${req.headers.host}/`, col('event_cover')), 'event_cover']]
        });
        const members = await EventMember.findAll({
            include: {
                model: User,
                attributes: [[fn('CONCAT', `${req.protocol}://${req.headers.host}/`, col('profile_photo')), 'profile_photo']]
            },
            attributes: ['eventId']
        });
        events.forEach(event => {
            const nou = members.filter(member => member.eventId === event.id).map(member => member.user.profile_photo);
            finalList.push({ event: event, members: nou });
        });
        //const nou = members.filter(member => member.eventId === 1);

        res.status(200).json(finalList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Validation Rules
exports.createValidator = () => {
    return [
        body('clubId', 'Invalid ID').exists().isInt().withMessage('ID must be integer'),
        body('name', 'Inavlid name').exists().isLength({ min: 5 }).withMessage('Too short name').custom((eventName, { req }) => {
            return Events.findOne({
                where: {
                    name: eventName
                }
            })
                .then(event => {
                    if (event) {
                        if (req.file) {
                            fs.unlinkSync(req.file.path);
                        }
                        throw new Error('Name already in use');
                    }
                })
        }),
        body('date', 'Invalid date format'),//.exists().isString(),
        body('time').exists(),
        body('description', 'Invalid description').exists().isString(),
        body('location', 'Invalid location').exists().isString(),
        body('radius', 'Invalid radius').exists().isInt(),
        body('sportId', 'Invalid sport type id').exists().isInt(),
        body('event_cover').optional()
    ]
}

exports.updateValidator = () => {
    return [
        //body('clubId', 'Invalid ID').exists().isInt().withMessage('ID must be integer'),
        body('name', 'Inavlid name').optional().isLength({ min: 5 }).withMessage('Too short name'),
        body('date', 'Invalid date format').optional(),
        body('time').optional(),
        body('description', 'Invalid description').optional().isString(),
        body('location', 'Invalid location').optional().isString(),
        body('radius', 'Invalid radius').optional().isInt(),
        body('sportId', 'Invalid sport type id').optional().isInt()
        //body('event_cover').exists()  
    ]
}

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}