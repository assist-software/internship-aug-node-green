module.exports= app => {
    const clubs=require("../controllers/club.controller.js");
    
    
    var router=require("express").Router();
    router.post("/create",clubs.validate(),clubs.create, clubs.sendMails);
    router.put("/:id",clubs.validateUpdate(),clubs.update);
    router.get("/:id",clubs.findOne);
    router.get("/",clubs.findAll);
    router.get("/details/:clubId",clubs.findDetails);
    router.post("/search",clubs.validateSearch(),clubs.search);
    router.delete("/:id",clubs.delete);
    //Custom
    router.get('/list/all', clubs.findAllWithMembers);

    app.use('/api/club',router); 
}