const db=require("../models");
const Users = db.User;
const Op=db.Sequelize.Op;

exports.get = (req, res) => {
    Users.findAll({
        where: {
            roleId: 2
        },
        attributes: ['first_name', 'last_name', 'email', 'gender']
    })
    .then(coach => {
        if(!coach) {
            res.status(404).send({message: 'There are coach'});
        }
        else {
            res.status(200).send(coach);
        }
    })
    .catch(err => {
        res.send({error: err.message});
    })
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

