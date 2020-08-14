
const controller = require('../controllers/auth.controller.js');
const express = require('express');
const Router = express.Router();


Router.post('/api/auth/login', controller.login);

module.exports = Router;