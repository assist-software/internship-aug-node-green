module.exports= app => {
    const clubinvites=require("../controllers/club-invite.controller.js");
    
    var router=require("express").Router();
    router.post("/create",clubinvites.validate(),clubinvites.create);
    
    router.get("/:clubId",clubinvites.list);

    router.delete("/:id",clubinvites.decline);

    router.post("/accept/:id",clubinvites.accept);

    app.use('/api/club/invite',router);
}