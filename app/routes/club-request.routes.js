module.exports = app => {
    const express = require('express');
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const clubRequestController = require('../controllers/club-request.controller');
    const Router = express.Router();
    Router.post('/api/club/request/create',auth.authenticate(), clubRequestController.create);
    Router.post('/api/club/request/accept/:requestId',auth.authenticate(), clubRequestController.accept);
    Router.delete('/api/club/request/decline/:requestId',auth.authenticate(), clubRequestController.decline);
    Router.get('/api/club/request/:clubId',auth.authenticate(), clubRequestController.list);
    app.use(Router);
};       