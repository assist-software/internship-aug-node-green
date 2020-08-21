const db=require("../models");
const { body, validationResult  }  = require('express-validator');
const Club=db.Club;
const User=db.User;
const ClubInvite=db.ClubInvite;
const ClubMember=db.ClubMember;
const sendEmail = require('../utils/email.utils.js');

exports.create = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

//check if the clubId exists.

    Club.findOne({
        where: {
            id: req.body.clubId
        }
    })
    .then((club) => {
        if(!club) {
            res.status(404).send({message: "club not found"});
            return
        }

//check if the user email exists.

        User.findOne({where:{email:req.body.email}})
        .then(user=> {
          if(!user){
            res.send({message:"User not found!!"});
            return
          }

//check if the user is already part of the club

          ClubMember.findOne({where:{
            clubId:club.id,
            userId:user.id
          }
          })
          .then(clubmember=>{
            if(clubmember)
            {
              res.send({message:"The member exists!"})
              return
            }

//check if the invite has been already sent

            ClubInvite.findOne({where:{
              clubId:req.body.clubId,
              email:req.body.email
            }
            })
            .then(invite=>{
              if(invite)
              {
                res.send({message:"The invite has been already sent !!"})
                return
              }

//create the invite
              
              ClubInvite.create({
                clubId:req.body.clubId,
                email:req.body.email,
              })
              .then(data => {
                const message=`Buna ziua! Avem placerea sa va invitam in clubul =${club.name}.`
                sendEmail(message,[req.body.email])
                res.status(200).send(data);
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the Club."
                });
              });

            })
          })
        })    
    })
    
}


exports.decline=(req,res)=>{
    const id = req.params.id;
  
    ClubInvite.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.status(200).send({
              message: "Invite was declined successfully!"
            });
          } else {
            res.send.status(404)({
              message: `Cannot decline invite with id=${id}. Maybe invite was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not decline invite with id=" + id
          });
        });
}
exports.accept=(req,res)=>{
    const id=req.params.id;
    
    ClubInvite.findByPk(id)
    .then(invite=>{
        if(!invite)
        {
            res.status(404).send({
                message:"The id doesnt exist!!"
            })
        }
        User.findOne({where:{email:invite.email}})
        .then(user=>{
            if(!user)
            {
                res.status(404).send({
                    message:"The email doesnt exist!!"
                })
            }

//create a member by the invitation

            const clubmember={
                userId:user.id,
                clubId:invite.clubId
            }
            ClubMember.create(clubmember);

//delete the invite

            ClubInvite.destroy({
                where: { id: id }
              })
                .then(num => {
                  if (num == 1) {
                    res.status(200).send({
                      message: "Invite was accepted !"
                    });
                  } else {
                    res.send.status(404)({
                      message: `Cannot accept invite with id=${id}. Maybe invite was not found!`
                    });
                  }
                })
                .catch(err => {
                  res.status(500).send({
                    message: "Could not acept invite with id=" + id
                  });
                });
    
              })
    })
    
}
exports.list = (req, res) => {

    ClubInvite.findAll({
      where: {
        clubId: req.params.clubId
      }
    })
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


exports.validate = (req, res, next) => {
    
    return [
        body('email').exists().notEmpty().isEmail(),
        body('clubId').exists().notEmpty().isInt()
    ]
}