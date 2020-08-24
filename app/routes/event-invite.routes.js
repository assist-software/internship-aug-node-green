module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());

    const eventInvite = require('../controllers/event-invite.controller.js');

    const eventMember = require('../controllers/event-member.controller.js');

    const utils = require('../utils/validate.utils.js');

    const router = require('express').Router();

    //create a new event - request
    router.post('/create',auth.authenticate(), eventInvite.validationRules('create'),utils.validate,eventInvite.create);

    //decline event-invite
    router.delete('/decline/:inviteId',eventInvite.validationRules('acceptAndDecline'),utils.validate,eventInvite.decline);

    //get a list of invites by eventId
    router.get('/:eventId',eventInvite.validationRules('get'),utils.validate,eventInvite.list);

    //accept event- invite
    router.post('/accept/:inviteId',eventInvite.validationRules('acceptAndDecline'),utils.validate,eventInvite.accept,eventMember.validationRules('create'),utils.validate,eventMember.create);

    app.use('/api/event/invite',router);
};