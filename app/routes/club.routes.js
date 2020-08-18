module.exports= app => {
    const clubs=require("../controllers/club.controller.js");
    const auth = require('../config/passport.config')();
    app.use(auth.initialize());
    const { userValidationRules,validate } = require('../controllers/validator.js')
    
    var router=require("express").Router();
    router.post("/create",auth.authenticate(), userValidationRules(),validate,clubs.create);
    router.put("/:id",auth.authenticate(), userValidationRules(),validate,clubs.update);
    router.get("/:id",auth.authenticate(), clubs.findOne);
    router.get("/",auth.authenticate(), clubs.findAll);
    router.post("/search",auth.authenticate(), userValidationRules(),validate,clubs.search);
    router.delete("/:id",auth.authenticate(), clubs.delete);
    app.use('/api/club',router);
}