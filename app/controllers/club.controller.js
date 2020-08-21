const db=require("../models");
const Club=db.Club;
const ClubMembers = db.ClubMember;
const Users = db.User;

const { body, validationResult  }  = require('express-validator');
const { User } = require("../models");

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


exports.findAll = (req, res) => {

    Club.findAll({attributes:['id','name','ownerId',"sportId"]})
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving clubs."
        });
      });
};

var globalData = [];
var photoArray = [];
exports.findAllWithMembers = (req, res) => {
  /*
  const clubResponse = [];
  Club.findAll({attributes:['id','name','ownerId',"sportId"]})
  .then(club => {
    clubResponse = club;
    const ownerIds = club.map(c => c.dataValues.ownerId);
    return User.findAll({
      where: {
        id: ownerIds
      }
    })
  }).then(users => {
    clubResponse = clubResponse.map(c => {
      c.dataValues.coachName = users.filter(user => user.dataValues.id === c.dataValues.ownerId)[0].first_name;
      return c;
    })

  }) 
*/
  Club.findAll({attributes:['id','name','ownerId',"sportId"]})
    .then(clubs => {
      if(clubs) {
        console.log(clubs);
        for(let i =0; i<clubs.length; i++) {
          ClubMembers.findAll({
            where: {
              clubId: clubs[i].id
            }
          })
          .then(members => {
            Users.findOne({
              where: {
                id: clubs[i].ownerId
              }
            })
            .then(user => {
              if(user) {
                let club = clubs[i];
                let coachName = user.first_name; 
                //globalData.push({club, coachName, members });

                for(let j =0; j<members.length; j++){
                  Users.findOne({
                    where: {
                      id: members[j].id
                    }
                  })
                  .then(user => {
                    let photo = user.profile_photo;
                    photoArray.push({photo})

                    if(j == members.length-1) {
                      console.log(photoArray);
                      globalData.push({club, coachName, photoArray });
                      photoArray=[];
                    }
                  })
                }

                if(i == clubs.length-1) {
                  res.status(200).json(globalData);
                  globalData=[];
                }
                /*
                for(let j =0; j<members.length; j++){
                  Users.findOne({
                    where: {
                      id: members[j].id
                    }
                  })
                  .then(user => {
                    let photo = user.profile_photo;
                    photoArray.push({photo})

                    if(j == members.length-1) {
                      globalData.push({club, coachName, photo });
                      photo=[];
                      
                    } 
                    
                  })
                }  
                */ 
            }
          })
        })
      }
    }
     
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

