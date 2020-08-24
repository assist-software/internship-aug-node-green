module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
   
    const users = require("../controllers/user.controller.js");

    const upload = require('../middlewares/upload.js');

    const utils = require('../utils/validate.utils.js');

    const router = require('express').Router();

    router.post('/create',auth.authenticate(),upload.single('profile_photo'),users.validationRules('create'),utils.validate, users.create);

    router.post('/search',auth.authenticate(),users.validationRules('search'),utils.validate,users.search);

    router.put('/:userId',auth.authenticate(),upload.single('profile_photo'),users.validationRules('update'),utils.validate,users.update);

    router.get('/athlete/list',auth.authenticate(),users.findAllAthletes);

    router.get('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),utils.validate, users.get);

    router.delete('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),utils.validate, users.delete);

    

    app.use('/api/user',router);
};