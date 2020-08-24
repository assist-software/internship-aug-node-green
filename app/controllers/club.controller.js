const db = require("../models");
const Club = db.Club;
const ClubMember = db.ClubMember;
const email = require('../utils/email.utils');


const Event = db.Event;
//const User=db.User;
const { Op } = require("sequelize");
const { body, validationResult } = require('express-validator');
const { User } = require("../models");

const clubMemberRoutes = require("../routes/club-member.routes");
const Mail = require("nodemailer/lib/mailer");
const { response } = require("express");

exports.create = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  //check if the club name exists

  Club.findOne({ where: { name: req.body.name } })
    .then(club => {

      if (club) {
        res.status(404).send({
          message: 'The club is already taken',
          club: club
        });
      } else {

        //create a club
        const club = {
          name: req.body.name,
          ownerId: req.body.ownerId,
          sportId: req.body.sportId
        }
        Club.create(club)

          .then(data => {
            res.status(200).send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occured while creating the Club"
            });
          });


      }

    })
}

exports.createTest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  console.log('Start');
  const club = await Club.findOne({ where: { name: req.body.name } });
  if (club) {
    res.status(404).send({
      message: 'The club is already taken',
      club: club
    });
  }

  const newClub = {
    name: req.body.name,
    ownerId: req.body.ownerId,
    sportId: req.body.sportId
  }

  await Club.create(newClub);
  const createdClubId = await Club.findOne({
    where: {
      name: req.body.name
    },
    attributes: ['id', 'name']
  });

  let emailArray = req.body.emailArray;
  if (emailArray) {
    const users = await User.findAll({ where: { email: emailArray } });

    console.log('Users found');
    for (let i = 0; i < users.length; i++) {
      await ClubMember.create({
        userId: users[i].id,
        clubId: createdClubId.id
      });
    }

    email(`You were invited to club ${createdClubId.name}`, emailArray);
  }

  res.send({ message: 'Succes' });
}


exports.update = async (req, res) => {
  try {
    const badEmails=[]
    const usedEmails=[]
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    
    const num=await Club.update(req.body, { where: { id: id } })
    if(!num)
    {
      res.status(404).send({
        message: `Cannot update Club with id=${id}. Maybe Club was not found!`
      });
    }
  
    const club= await Club.findOne({
      where: {
        id: id
      }
    });
    
    let emailArray = req.body.emailArray;
    if(emailArray!=undefined){
      const users = await User.findAll({ where: { email: emailArray } });
      const usersEmail=users.map(user=>user.email)
      for (let i = 0; i < users.length; i++) {
        const isMember=await ClubMember.findOne({where:{
          userId: users[i].id,
          clubId: club.id
        }})
        if(!isMember){
          await ClubMember.create({
            userId: users[i].id,
            clubId: club.id
          });
          email(`You were invited to club ${club.name}`, [users[i].email]);
        }else{
          usedEmails.push(users[i].email)
        }
      }
      for(let i=0;i<emailArray.length;i++){
        let mail=emailArray[i]
        if(usersEmail.indexOf(mail)==-1){
          badEmails.push(mail)
        }
      }
    }
    res.status(200).send({message:"Update succesfull!",badEmails:badEmails,alreadyMember:usedEmails})
  }
  catch(err){
    res.status(500).send({message:"Error"})
  }
  
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

exports.findDetails = (req, res) => {
  const id = req.params.clubId;
  var memberIds = [];
  var response = {
    members: [],
    owner: [],
    ownerClubs: [],
    events: []
  }
  Club.findByPk(id)
    .then(club => {
      User.findOne({
        attributes: ['id', 'first_name', 'last_name'],
        where: { id: club.ownerId }
      })
        .then(user => {
          response.owner = user;
          Club.findAll({
            attributes: ['name'],
            where: { ownerId: user.id }
          })
            .then(club => {
              response.ownerClubs = club;

              ClubMember.findAll({ where: { clubId: id } })
                .then(member => {
                  if (member) {
                    for (let i = 0; i < member.length; i++) {
                      memberIds.push(member[i].userId)
                    }
                  }
                  User.findAll({
                    attributes: ['first_name', 'last_name'],
                    where: {
                      id: { [Op.in]: memberIds }
                    }
                  }).then(user => {
                    response.members = user;
                    Event.findAll({
                      attributes: { exclude: ['createdAt', 'updatedAt'] },
                      where: { clubId: id }
                    })
                      .then(event => {
                        response.events = event
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
}

exports.findAll = (req, res) => {

  Club.findAll({ attributes: ['id', 'name', 'ownerId', "sportId"] })
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


exports.findAllWithMembers = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      attributes: ['id', 'name', 'ownerId', "sportId"]
    })
    const clubsId = clubs.map(club => club.id);
    const clubsOwners = clubs.map(club => club.ownerId);

    const clubMembers = await ClubMember.findAll({
      where: {
        clubId: clubsId
      }
    })

    const users = await User.findAll();

    let clubList = [];
    for (let i = 0; i < clubs.length; i++) {
      let club = clubs[i];
      let coachName = users.find(owner => owner.id === club.ownerId);
      coachName = coachName.first_name;
      let membrii = clubMembers.filter(membru => membru.clubId === club.id);
      let photoArray = [];
      for (let j = 0; j < membrii.length; j++) {
        photo = users.find(user => user.id === membrii[j].userId);
        photo = `${req.protocol}://${req.headers.host}/${photo.profile_photo}`;
        photoArray.push({ photo: photo });
      }
      clubList.push({ club, coachName, photoArray });
    }
    res.json(clubList);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.search = (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const ownerId = req.body.ownerId;
  const name = req.body.name;
  if (ownerId && name) {
    Club.findAll({
      where: {
        ownerId: ownerId,
        name: name
      }
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error ocurred while retrieving clubs"
        });
      });
  } else if (ownerId) {
    Club.findAll({
      where: {
        ownerId: ownerId
      }
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error ocurred while retrieving clubs"
        });
      });
  } else if (name) {
    Club.findAll({
      where: {
        name: name
      }
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error ocurred while retrieving clubs"
        });
      });
  } else {
    res.status(404).send({ message: "You have to search by something!" })
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

exports.sendMails = (req, res) => {
  let senderList = req.body.emailArray;
  console.log('-----------------------------------');
  console.log(senderList);

  //email.send();
}


exports.validate = () => {
  return [

    body('sportId').exists().withMessage('Not exist').notEmpty().withMessage('is Empty').isInt().withMessage('not Int'),
    body('ownerId').optional().isInt(),
    body('name').exists().withMessage('not exists').notEmpty().isString().withMessage('not string')

  ]
}



exports.validateUpdate = () => {
  return [
    body('sportId').optional().isInt(),
    body('ownerId').optional().isInt(),
    body('name').optional().isString().custom(value => {
      return Club.findOne({ where: { name: value } }).then(club => {
        if (club) {
          throw new Error('Name already in use!!');
        }
      })
    })

  ]
}
exports.validateSearch = () => {
  return [
    body('ownerId').optional().isInt(),
    body('sportId').optional().isInt(),
    body('name').optional().isString()
  ]
}

