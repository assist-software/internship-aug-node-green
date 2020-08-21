module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
   
    const users = require("../controllers/user.controller.js");

    const upload = require('../middlewares/upload.js');

    const router = require('express').Router();

    router.post('/create',auth.authenticate(),upload.single('profile_photo'),users.validationRules('create'),users.validate, users.create);

    router.post('/search',auth.authenticate(),users.validationRules('search'),users.validate,users.search);

    router.put('/:userId',auth.authenticate(),upload.single('profile_photo'),users.validationRules('update'),users.validate,users.update);

    router.get('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),users.validate, users.get);

    router.delete('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),users.validate, users.delete);


    app.use('/api/user',router);
};