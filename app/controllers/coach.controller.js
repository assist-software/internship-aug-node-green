const db=require("../models");
const { ClubRequest } = require("../models");
const { response } = require("express");
const { get } = require("./user.controller");
const Users = db.User;
const Clubs = db.Club;
const Op=db.Sequelize.Op;

var clubtest = ['club1', 'club2'];

 async function getClubs(coachId,) {
    Clubs.findAll({
        where: {
            id: coachId
        },
        attributes: ['name']
    })
    .then(clubs => {
        if(clubs) {
            //console.log(clubs.dataValues.name);
            var nameArray = [];
            for(let i = 0; i<clubs.length; i++) {
                nameArray.push(clubs[i].name);
            }
            console.log('\n\n\nINSIDE FUNCTION');
            
            console.log(nameArray);
            return nameArray;
        }
        else throw new Error();
    })
}

function getData(coachId) {
    Clubs.findAll({
        where: {
            ownerId: coachId
        }
    })
    .then(cluburi => {
        if(cluburi) {
            var data = [];
            data.push([ cluburi]);
            return data;
        }
    })
}

var callBack = () => {
    console.log('Data returnet');
}

var globalData = [];
exports.get = (req, res) => {
    Users.findAll({
        where: {
            roleId: 2
        },
        attributes: ['id', 'first_name', 'last_name', 'email']
    })
    .then(antrenori => { 
        if(antrenori) {
            //Pentru fiecare Coach cautam cluburile la care el este owner
            for(let i = 0; i<antrenori.length; i++) { 
                Clubs.findAll({
                    where: {
                        ownerId: antrenori[i].id
                    },
                    attributes: ['name']
                })
                .then(cluburi => {
                    if(cluburi) {
                        let antrenor = antrenori[i];
                        //Memoram datele antrenorului si cluburilor acestuia la fiecare iteratie
                        globalData.push({antrenor, cluburi});
                        //Verificare daca toate datele au fost introduse
                        if(i == antrenori.length-1){
                            //Transmiterea datelor
                            //res.header("Access-Control-Allow-Origin", "*");
                            res.status(200).json(globalData);
                            globalData=[];
                        } 
                    }
                    
                })
                .catch(err => {
                    res.send({error: err.message});
                })
           }
        }
    })
    .catch(err => {
        res.send({error: err.message});
    })
}

exports.newGet = async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                roleId: 2
            },
            attributes: ['id', 'first_name', 'last_name', 'email']
        })
        res.json(users);
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

