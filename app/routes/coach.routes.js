module.exports = app => {
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const coach = require('../controllers/coach.controller');
    const user = require('../controllers/user.controller')

    const router = require('express').Router();

    router.post('/',auth.authenticate() ,coach.setRole ,user.validationRules('create'),user.validate, user.create);
    router.put('/:coachId',auth.authenticate() ,coach.setId ,user.validationRules('update'),user.validate, user.update);
    router.get('/:coachId',auth.authenticate(), coach.getById);
    router.get('/', coach.get);
    router.delete('/:coachId', auth.authenticate() ,coach.setId, user.delete );

    router.delete('/delete/list',coach.deleteListOfCoaches);
    
    app.use('/api/coach',router);
};