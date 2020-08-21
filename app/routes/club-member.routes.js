module.exports= app => {
    const clubmembers=require("../controllers/club-member.controller.js");
    
    var router=require("express").Router();
    router.post("/create",clubmembers.validate(),clubmembers.create);
    router.get("/:id",clubmembers.list);
    router.get("/status/:userId",clubmembers.sendStatus);
    router.delete("/remove/:id",clubmembers.remove);

    app.use('/api/club/member',router);
}