const db=require("../models");
const { ClubRequest } = require("../models");
const { response } = require("express");
const { get } = require("./user.controller");
const Users = db.User;
const Clubs = db.Club;
const Op=db.Sequelize.Op;

exports.get = async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                roleId: 2
            },
            attributes: ['id', 'first_name', 'last_name', 'email']
        })
        const usersId = users.map(user => user.id);
        
        const clubs = await Clubs.findAll({
            where: {
                ownerId: usersId
            }
        })

        let coachList = [];
        for(let i=0; i<users.length; i++) {
            let antrenor = users[i];
            let cluburi = clubs.filter(club => club.ownerId === users[i].id).map(club => {
                let name = club.name;
                return {name}
            })
            coachList.push({antrenor, cluburi}); 
        }
        res.json(coachList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.getById = (req, res) => {
    Users.findOne({
        where: {
            id: req.params.coachId,
            roleId: 2
        },
        attributes: ['first_name', 'last_name', 'email', 'gender']
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({message: 'Coach not found!'});
        }
        else {
            return res.status(200).send({user});
        }
    })
    .catch(err => {
        res.send({error: err.message});
    })
}

exports.setRole = (req, res, next) => {
    req.body.roleId = 2;
    next();
}

exports.setId = (req, res, next) => {
    req.params.userId = req.params.coachId;
    next();
}

