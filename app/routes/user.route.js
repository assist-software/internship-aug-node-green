module.exports = app => {
    const users = require("../controllers/user.controller.js");

    const router = require('express').Router();



    router.post('/create',users.validate('create'),users.create);

    router.post('/search',users.validate('search'),users.search);

    router.put('/:userId',users.validate('update'),users.update);

    router.get('/:userId',users.get);

    router.delete('/:userId',users.delete);

    app.use('/api/user',router);
};