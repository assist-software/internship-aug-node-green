module.exports= app => {
    const clubs=require("../controllers/club.controller.js");
    const { userValidationRules,validate } = require('../controllers/validator.js')
    
    var router=require("express").Router();
    router.post("/create",userValidationRules(),validate,clubs.create);
    router.put("/:id",userValidationRules(),validate,clubs.update);
    router.get("/:id",clubs.findOne);
    router.get("/",clubs.findAll);
    router.post("/search",userValidationRules(),validate,clubs.search);
    router.delete("/:id",clubs.delete);
    app.use('/api/club',router);
}