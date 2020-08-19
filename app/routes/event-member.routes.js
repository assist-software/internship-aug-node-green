module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());

    const events = require('../controllers/event-member.controller.js');

    const router = require('express').Router();

    //create a new member 
    router.post('/create',auth.authenticate(),events.validationRules('create'),events.validate,events.create);

    //get a list of users by eventId
    router.get('/:eventId',auth.authenticate(),events.list);
    
    //delete a member by inviteId
    router.delete('/remove/:inviteId',auth.authenticate(),events.remove);

    app.use('/api/event/member',router);
};