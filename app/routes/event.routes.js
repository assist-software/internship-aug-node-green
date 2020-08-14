const express = require('express');
const db = require('../models/index.js');
const eventController = require('../controllers/event.controller');

const Router = express.Router();
const Clubs = db.Club;

// Create event
Router.post('/create',eventController.createValidator(), eventController.validate, eventController.create);

// Returns a list of events based on post data
Router.post('/search', eventController.search);

// Returns an event by his Id
Router.get('/:eventId', eventController.get);

// Update data of an event
Router.put('/:eventId', eventController.update);

// Delete an event by his Id
Router.delete('/:eventId', eventController.delete);

module.exports = Router;