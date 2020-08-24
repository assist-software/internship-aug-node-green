const { Club } = require('../models/index.js');

    module.exports = app => {
    const eventRequest = require('../controllers/event-request.controller.js');

    const eventMember = require('../controllers/event-member.controller.js');

    const utils = require('../utils/validate.utils.js');

    const router = require('express').Router();

    //create a new event - request
    router.post('/create',eventRequest.validationRules('create'),utils.validate,eventRequest.create);

    //accpet request
    router.post('/accept/:requestId',eventRequest.validationRules('acceptAndDelete'),utils.validate,eventRequest.accept,eventMember.validationRules('create'),utils.validate,eventMember.create);

    //decline request
    router.delete('/decline/:requestId',eventRequest.validationRules('acceptAndDelete'),utils.validate,eventRequest.decline);

    //get a list of request by eventId
    router.get('/:eventId',eventRequest.validationRules('get'),utils.validate,eventRequest.list);

    app.use('/api/event/request',router);
};
