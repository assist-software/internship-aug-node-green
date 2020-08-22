const db=require("../models");
const Club=db.Club;
const ClubMember=db.ClubMember;
const Event=db.Event;
const User=db.User;
const { Op } = require("sequelize");
const { body, validationResult  }  = require('express-validator');

const clubMemberRoutes = require("../routes/club-member.routes");

exports.create=(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

//check if the club name exists

    Club.findOne({ where: {name: req.body.name}} )
    .then(club => {

        if(club){
            res.status(404).send({
                message:'The club is already taken',
                club:club
            });
        }else{

        //create a club
        const club={
          name:req.body.name,
          ownerId:req.body.ownerId,
          sportId:req.body.sportId
        }
        Club.create(club)

        .then(data=>{
            res.status(200).send(data);
        })
        .catch(err=>{
            res.status(500).send({
                message:
                    err.message||"Some error occured while creating the Club"
            });
        });          
          

        }
        
    })

    
    
}
exports.update=(req,res)=>{
    const id=req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    Club.update(req.body,{where:{id:id}})
    .then(num=>{
        if (num == 1) {
          res.send({
              message: "Club was updated successfully."
          });
        } else {
          res.status(404).send({
              message: `Cannot update Club with id=${id}. Maybe Club was not found!`
          });
        }
    })
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

exports.findDetails=(req,res)=>{
  const id=req.params.clubId;
  var memberIds=[];
  var response={
    members:[],
    owner:[],
    ownerClubs:[],
    events:[]
  }
  Club.findByPk(id)
  .then(club=>{
    User.findOne({
      attributes:['id','first_name','last_name'],
      where:{id:club.ownerId}})
    .then(user=>{
      response.owner=user;
      Club.findAll({
        attributes:['name'],
        where:{ownerId:user.id}})
      .then(club=>{
        response.ownerClubs=club;
        
        ClubMember.findAll({where:{clubId:id}})
        .then(member=>{
          if(member)
          {
            for(let i=0;i<member.length;i++)
            {
              memberIds.push(member[i].userId)
            }
          }
          User.findAll({
            attributes:['first_name','last_name'],
            where:{
              id:{[Op.in]:memberIds}
          }}).then(user=>{
            response.members=user;
            Event.findAll({attributes:{exclude:['createdAt','updatedAt']},
            where:{clubId:id}})
            .then(event=>{
              response.events=event
              res.send(response);
            })
            
          })
        })
      })
      
    })
  })
  .catch(err => {
    res.status(404).send({
      message: "Error retrieving Club with id=" + id
    });
  })
  /*Club.findByPk(id)
  .then(club=>{
    if(club)
    {
      User.findOne({
        attributes:['id','name'],
        where:{id:club.ownerId}
      })
    }
    
    .then(user=>{
      response.owner=user
      res.send(club.ownerId)
    })
    
  })
  /*.catch(err => {
    res.status(500).send({
      message: "Error retrieving Club with id=" + id
    });
  });*/
  /*
  ClubMember.findAll({
    where:{
      clubId:id
    }
  }).then(data=>{
      if(data){
        for(let i=0;i<data.length;i++)
          {
            memberIds.push(data[i].userId)
          }
      }
      User.findAll({
        attributes:['id','name'],
        where:{
          id:{[Op.in]:memberIds}
        }
      }).then(user=>{
        response.members=user
        User.findOne({where:{id:club.owner}})
      })
  })
  */
}

exports.findAll = (req, res) => {

    Club.findAll({attributes:['id','name','ownerId',"sportId"]})
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const ownerId=req.body.ownerId;
    const name=req.body.name;
    const sportId=req.body.sportId;
    if(ownerId&&name)
    {
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
    }else if(ownerId){
      Club.findAll({where:{
        ownerId:ownerId
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
    }else if(name){
      Club.findAll({where:{
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
    }else{
      res.status(404).send({message:"You have to search by something!"})
    }
    

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

  exports.validate=()=> {
    return [
    
      body('sportId').exists().notEmpty().isInt(),
      body('ownerId').optional().isInt(),
      body('name').exists().notEmpty().isString()
      
    ]
  }



  exports.validateUpdate=()=>{
    return [
      body('sportId').optional().isInt(),
      body('ownerId').optional().isInt(),
      body('name').optional().isString().custom(value => {
        return Club.findOne({ where: {name: value}} ).then(club => {
            if(club){
                throw new Error('Name already in use!!');
            }
        })
      })
      
    ]
  }
  exports.validateSearch=()=>{
    return[
      body('ownerId').optional().isInt(),
      body('sportId').optional().isInt(),
      body('name').optional().isString()     
    ]
  }

