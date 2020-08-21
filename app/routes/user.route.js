module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    
    const users = require("../controllers/user.controller.js");

    const router = require('express').Router();

    router.post('/create',auth.authenticate(), users.validate('create'), users.create);

    router.post('/search',auth.authenticate(), users.validate('search'),users.search);

    router.put('/:userId',auth.authenticate(), users.validate('update'),users.update);

    router.get('/:userId',/*auth.authenticate(),*/ users.get);

    router.delete('/:userId',auth.authenticate(), users.delete);

    app.use('/api/user',router);
};