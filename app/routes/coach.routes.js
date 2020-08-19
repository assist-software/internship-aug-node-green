module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const coach = require('../controllers/coach.controller');
    const user = require('../controllers/user.controller')

    const router = require('express').Router();

    router.post('/api/coach',auth.authenticate() ,coach.setRole ,user.validate('create'), user.create);
    router.put('/api/coach/:coachId',auth.authenticate() ,coach.setId ,user.validate('update'), user.update);
    router.get('/api/coach/:coachId',auth.authenticate(), coach.getById);
    router.get('/api/coach', auth.authenticate(), coach.get);
    router.delete('/api/coach/:coachId', auth.authenticate() ,coach.setId, user.delete );
    app.use(router);
};