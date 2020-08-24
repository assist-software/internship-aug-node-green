module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const coach = require('../controllers/coach.controller');
    const user = require('../controllers/user.controller');
    const utils = require('../utils/validate.utils.js');

    const router = require('express').Router();

    router.post('/',auth.authenticate() ,coach.setRole ,coach.createValidationRules(),utils.validate,coach.create);
    router.put('/:coachId',auth.authenticate() ,coach.setId ,user.validationRules('update'),utils.validate, user.update);
    router.get('/:coachId',auth.authenticate(), coach.getById);
    router.get('/', coach.get);
    router.delete('/:coachId', auth.authenticate() ,coach.setId, user.delete );

    router.delete('/delete/list',coach.deleteListOfCoaches);
    
    
    //localhost:8080/api/coachPag?page=1&limit=1
    router.get('/api/coachPage', coach.getPagination);

    app.use(router);
    app.use('/api/coach',router);
};