module.exports= app => {
    const clubs=require("../controllers/club.controller.js");
    const { userValidationRulesCreate,userValidationRulesUpdate,validate } = require('../controllers/validator.js')
    
    var router=require("express").Router();

    router.post("/",userValidationRulesCreate(),validate,clubs.create);
    router.put("/",userValidationRulesUpdate(),validate,clubs.update);
    app.use('/api/club',router);
}