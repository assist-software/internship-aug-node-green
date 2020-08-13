const db=require("../models");
const Club=db.Club;
const Op=db.Sequelize.Op;


exports.create=(req,res)=>{

    //create a club
    const club={
        name:req.body.name,
        ownerId:req.body.ownerId
    }

    Club.create(club)

        .then(data=>{
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send({
                message:
                    err.message||"Some error occured while creating the Club"
            });
        });
}
exports.update=(req,res)=>{
    const id=req.params.id;
    Club.update(req.body,{
        where:{id: id}
    })
    .then(num=>{
        if(num==1){
            res.send({
                message: "Club was updated succesfully!"
            });
        }
        else{
            res.send({
                message: 'Cannot update Tutorial with id=${id}.'
            });
            
        }
    })
}
