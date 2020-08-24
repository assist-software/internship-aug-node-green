module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const coach = require('../controllers/coach.controller');
    const user = require('../controllers/user.controller')

    const router = require('express').Router();

    router.post('/api/coach',auth.authenticate() ,coach.setRole ,user.validationRules('create'),user.validate, user.create);
    router.put('/api/coach/:coachId',auth.authenticate() ,coach.setId ,user.validationRules('update'),user.validate, user.update);
    router.get('/api/coach/:coachId',auth.authenticate(), coach.getById);
    router.get('/api/coach', coach.get);
    router.delete('/api/coach/:coachId', auth.authenticate() ,coach.setId, user.delete );
    
    //localhost:8080/api/coachPag?page=1&limit=1
    router.get('/api/coachPage', coach.getPagination);

    app.use(router);
};