const db=require("../models");
const { body, validationResult  }  = require('express-validator');
const Club=db.Club;
const User=db.User;
const ClubMember=db.ClubMember;
const ClubRequest=db.ClubRequest;
const { Op } = require("sequelize");
exports.create=(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

//check if the member already exists

    ClubMember.findOne({where:{
      clubId:req.body.clubId,
      userId:req.body.userId
    }
    })
    .then(clubmember=>{
      if(clubmember){
        res.send({message:"The member already exists!!"})
      }
    });

    //create a member
    const clubmember={
        clubId:req.body.clubId,
        userId:req.body.userId
    }

    ClubMember.create(clubmember)
    .then(data=>{
      res.status(200).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message:
            err.message || "Some error occured while creating a club member"
        });
    });       

    
}

exports.remove=(req,res)=>{

    const id = req.params.id;
  
    ClubMember.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.status(200).send({
              message: "Member was removed successfully!"
            });
          } else {
            res.send.status(404)({
              message: `Cannot remove member with id=${id}. Maybe member was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not remove member with id=" + id
          });
        });
}

exports.list=(req,res)=>{
    const id=req.params.id;
    ClubMember.findAll({where:{clubId:id}})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving club members."
        });
      });
}
exports.sendStatus=(req,res)=>{
  const userId=req.params.userId;
  var clubIds=[]
  var clubIdsRequest=[]
  
  var response={
    joined:[],
    pending:[],
    new:[]
  }
  ClubMember.findAll({where:{userId:userId}})
  .then(data=>{
    if(data)
    {
      //response.joined=data;
      for(let i=0;i<data.length;i++)
      {
        clubIds.push(data[i].clubId)
      }
      
    }
    Club.findAll({
      attributes:['id','name','ownerId',"sportId"],
      where:{
      id:{[Op.in]:clubIds}
    }}).then(data=>{
      if(data)
      {
        response.joined=data
      }
      ClubRequest.findAll({where:{userId:userId}})
      .then(data=>{
        if(data)
        {
          //response.pending=data
          for(let i=0;i<data.length;i++)
          {
            clubIdsRequest.push(data[i].clubId)
            clubIds.push(data[i].clubId)
          }
          
        }
        Club.findAll({
          attributes:['id','name','ownerId',"sportId"],
          where:{
          id:{[Op.in]:clubIdsRequest}
        }})
        .then(data=>{
          if(data)
          {
            response.pending=data
          }
          Club.findAll({
            attributes:['id','name','ownerId',"sportId"],
            where:{
            id:{[Op.notIn]: clubIds}
          }})
          .then(data=>{
            if(data){
              response.new=data
        
            }
            res.status(200).send(response)
          })
        })

    })

    
      

    })
  }) 
}
exports.validate = () => {
    
    return [
        body('userId').exists().notEmpty().isInt().custom(value => {
          return User.findOne({ where: {id: value}} ).then(user=> {
              if(!user){
                  throw new Error('User not found!!');
              }
          })
        }),
        body('clubId').exists().notEmpty().isInt().custom(value => {
          return Club.findOne({ where: {id: value}} ).then(club=> {
              if(!club){
                  throw new Error('Club not found!!');
              }
          })
        })
    ]
}
