module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());

    const events = require('../controllers/event-member.controller.js');

    const router = require('express').Router();

    //create a new member 
    router.post('/create',auth.authenticate(),events.validationRules('create'),events.validate,events.create);

    //get a list of users by eventId
    router.get('/:eventId',events.validationRules('get'),events.validate,events.list);
    
    //delete a member by inviteId
    router.delete('/remove/:memberId',events.validationRules('delete'),events.validate,events.remove);

    // check if user is member
    router.get('/membership/:userId',auth.authenticate(),events.isMemberAnyEvent);

    //find events by date by userId
    router.post('/eventsByDate',auth.authenticate(),events.findEventsByDate);

    app.use('/api/event/member',router);
};