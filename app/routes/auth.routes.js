module.exports = app => {
    const userRegistration = require('../controllers/user.controller.js');
    const utils = require('../utils/validate.utils.js');
    const controller = require('../controllers/auth.controller.js');
    const express = require('express');
    //const users = require("../controllers/user.controller.js");
    const Router = express.Router();

    Router.post('/api/auth/login', controller.login);
    Router.post('/api/auth/register', userRegistration.validationRules('create'),utils.validate, userRegistration.create);
    Router.post('/api/auth/reset-password', controller.reset);
    
    app.use(Router);
};