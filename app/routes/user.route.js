module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    /*
    // Photo upoading code
    const multer = require('multer');

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './images/profile_photo/');
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }
    });
    const upload  = multer({storage: storage}); */

    const users = require("../controllers/user.controller.js");

    const router = require('express').Router();

    router.post('/create',auth.authenticate(), users.validationRules('create'), users.validate, users.create);

    router.post('/search',auth.authenticate(),users.validationRules('search'),users.validate,users.search);

    router.put('/:userId',auth.authenticate(),users.validationRules('update'),users.validate,users.update);

    router.get('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),users.validate, users.get);

    router.delete('/:userId',auth.authenticate(),users.validationRules('verifyUserId'),users.validate, users.delete);

    app.use('/api/user',router);
};