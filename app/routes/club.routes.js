module.exports= app => {
    const clubs=require("../controllers/club.controller.js");
    
    
    var router=require("express").Router();
    router.post("/create",clubs.validate(),clubs.create);
    router.put("/:id",clubs.validateUpdate(),clubs.update);
    router.get("/:id",clubs.findOne);
    router.get("/",clubs.findAll);
    router.post("/search",clubs.validateSearch(),clubs.search);
    router.delete("/:id",clubs.delete);

    app.use('/api/club',router); 
}