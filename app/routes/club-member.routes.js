module.exports= app => {
    const clubmembers=require("../controllers/club-member.controller.js");
    
    var router=require("express").Router();
    router.post("/create",clubmembers.validate(),clubmembers.create);
    //api/club/member/id?page=1&limit=1
    router.get("/:id",clubmembers.list);
    router.get("/status/:userId",clubmembers.sendStatus);
    router.delete("/remove/:id",clubmembers.remove);

    //custom get route
    //router.get("/users/:clubId",clubmembers.newList);

    app.use('/api/club/member',router);
}