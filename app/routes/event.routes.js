module.exports = app => {
    const express = require('express');
    const db = require('../models/index.js');
    const authJwt = require('../middlewares/authJwt');
    const event = require('../controllers/event.controller');
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const Router = express.Router();
    const Clubs = db.Club;
    Router.post('/create', auth.authenticate(), event.createValidator(), event.validate, event.create);
    Router.post('/search', auth.authenticate(), event.search);
    Router.get('/:eventId', auth.authenticate(), event.get);
    Router.put('/:eventId', auth.authenticate(), event.updateValidator(), event.validate, event.update);
    Router.delete('/:eventId', auth.authenticate(), event.delete);
    app.use('/api/event', Router);
};