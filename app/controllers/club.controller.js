const db=require("../models");
const Club=db.Club;
const Op=db.Sequelize.Op;


exports.create=(req,res)=>{

    //create a club
    const club={
        name:req.body.name,
        ownerId:req.body.ownerId
    }

    Club.findOne({ where: {name: req.body.name}} )
    .then(club => {
        if(club){
            res.send({
                message:'The club is already taken',
                club:club
            });
        }
    })

    
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

    const club={
      name:req.body.name,
      ownerId:req.body.ownerId
    }

    Club.findOne({ where: {name: req.body.name}} )
    .then(club => {
        if(club){
            res.send({
                message:'The club is already taken',
                club:club
            });
        }
    })

    
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

    .catch(err=>{
        res.status(500).send({
            message:"Error while updating club "+id
        });
    });
}


exports.findOne = (req, res) => {

    const id = req.params.id;
  
    Club.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Club with id=" + id
        });
      });
};


exports.findAll = (req, res) => {

    Club.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving clubs."
        });
      });
};

exports.search = (req,res)=>{

    const ownerId=req.body.ownerId;
    const name=req.body.name;

    Club.findAll({where:{
        ownerId:ownerId,
        name:name
    }})
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message:
            err.message || "Some error ocurred while retrieving clubs"
        });
    });

};
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Club.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Club was deleted successfully!"
          });
        } else {
          res.send.status(204)({
            message: `Cannot delete Club with id=${id}. Maybe Club was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Club with id=" + id
        });
      });
  };


