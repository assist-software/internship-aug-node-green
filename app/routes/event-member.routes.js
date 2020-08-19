module.exports = app => {
    const events = require('../controllers/event-member.controller.js');

    const router = require('express').Router();

    //create a new member 
    router.post('/create',events.validationRules('create'),events.validate,events.create);

    //get a list of users by eventId
    router.get('/:eventId',events.validationRules('get'),events.validate,events.list);
    
    //delete a member by inviteId
    router.delete('/remove/:memberId',events.validationRules('delete'),events.validate,events.remove);

    app.use('/api/event/member',router);
};