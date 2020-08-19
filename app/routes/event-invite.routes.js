module.exports = app => {
    const eventInvite = require('../controllers/event-invite.controller.js');

    const eventMember = require('../controllers/event-member.controller.js');

    const router = require('express').Router();

    //create a new event - request
    router.post('/create',eventInvite.validationRules('create'),eventInvite.validate,eventInvite.create);

    //decline event-invite
    router.delete('/decline/:inviteId',eventInvite.validationRules('acceptAndDecline'),eventInvite.validate,eventInvite.decline);

    //get a list of invites by eventId
    router.get('/:eventId',eventInvite.validationRules('get'),eventInvite.validate,eventInvite.list);

    //accept event- invite
    router.post('/accept/:inviteId',eventInvite.validationRules('acceptAndDecline'),eventInvite.validate,eventInvite.accept,eventMember.validationRules('create'),eventMember.validate,eventMember.create);

    app.use('/api/event/invite',router);
};