const db = require('../models/index');
const { ClubRequest, ClubMember } = require('../models/index');
const Clubs = db.Club;
const Users = db.User;
const ClubRequests = db.ClubRequest;



exports.create = (req, res) => {


//check if the clubId exists.

    Clubs.findOne({
        where: {
            id: req.body.clubId
        }
    })
    .then((club) => {
        if(!club) {
            res.status(404).send({message: "club not found"});
            return
        }

//check if the user exists.

        Users.findOne({where:{id:req.body.userId}})
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

            ClubRequest.findOne({where:{
              clubId:req.body.clubId,
              userId:req.body.userId
            }
            })
            .then(request=>{
              if(request)
              {
                res.send({message:"The request has been already sent !!"})
                return
              }

//create the invite
              
              ClubRequest.create({
                clubId:req.body.clubId,
                userId:req.body.userId,
              })
              .then(data => {
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

exports.accept = (req, res) => {
    ClubRequests.findOne({
        where: {
            id: req.params.requestId
        }
    })
    .then(request => {
        if(!request) {
            res.status(404).send({message: "Request not found"});
        }

        db.ClubMember.create({
            userId: request.userId,
            clubId: request.clubId
        });

        db.ClubRequest.destroy({
            where: {
                id: req.params.requestId
            }
        })
        res.status(200).send({message: "Request deleted, user registered"});
    })
    .catch(err => {
        res.send({error: err.message});
    });
}

exports.decline = (req, res) => {
    ClubRequests.findOne({
        where: {
            id: req.params.requestId
        }
    })
    .then(request => {
        if(!request) {
            res.status(404).send({message: "Request not found"});
        }
    
        ClubRequests.destroy({
            where: {
                id: req.params.requestId
            }
        })
        res.status(200).send({message: "Request deleted"});
    })
    .catch(err => {
        res.send({error: err.message});
    });
}

exports.list = (req, res) => {
    ClubRequests.findAll({
        where: {
            clubId: req.params.clubId
        },
        attributes: ['clubId', 'userId']
    })
    .then(requests => {
        if(!requests) {
            res.status(404).send({message: 'There are no requests'});
        }
        else {
            res.status(200).send(requests);
        }
    })
    .catch(err => {
        res.send({error: err.message});
    })
}