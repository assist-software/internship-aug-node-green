module.exports = app => {
    const express = require('express');
    const db = require('../models/index.js');
    const authJwt = require('../middlewares/authJwt');
    const event = require('../controllers/event.controller');
    const auth = require('../config/passport.config')();
    const jwtRoles = require('../middlewares/authJwt');

    const upload = require('../middlewares/upload.js');

    app.use(auth.initialize());
    const Router = express.Router();
    const Clubs = db.Club;
    Router.post('/create', auth.authenticate(),upload.single('event_cover'), event.createValidator(), event.validate, event.create);
    Router.post('/search', auth.authenticate(), event.search);
    
    Router.get('/:eventId', auth.authenticate(), event.get);
    Router.put('/:eventId', auth.authenticate(),upload.single('event_cover'), event.updateValidator(), event.validate, event.update);
    Router.delete('/:eventId', auth.authenticate(), event.delete);

    //get all events related to an user --  mobile
    Router.get('/events/:userId',auth.authenticate(),event.findAllEventsByUserId);

    //get all event related to a club -- mobile
    Router.get('/eventsByClub/:userId',auth.authenticate(), event.findEventsByClub);

    //get all events with all their members -- front
    Router.get('/allEvents/list',auth.authenticate(),event.findAllEventsWithMembers);
    app.use('/api/event', Router);
};

//nume, prenume