const db = require("../models");
const { ClubRequest } = require("../models");
const { response } = require("express");
const { get } = require("./user.controller");
const Users = db.User;
const Clubs = db.Club;
const Op = db.Sequelize.Op;
const sendEmail = require('../utils/email.utils.js');
const bcrypt = require('bcrypt');
const { body } = require('express-validator');

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
        for (let i = 0; i < users.length; i++) {
            let antrenor = users[i];
            let cluburi = clubs.filter(club => club.ownerId === users[i].id).map(club => {
                let name = club.name;
                return { name }
            })
            coachList.push({ antrenor, cluburi });
        }
        res.json(coachList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getPagination = async (req, res) => {
    try {

        let page = req.query.page;
        let limit = req.query.limit;
        let offset = (page - 1) * limit;

        const coaches = await Users.findAndCountAll({
            where: {
                roleId: 2
            },
            attributes: ['id', 'first_name', 'last_name', 'email'],
            offset: offset,
            limit: limit
        })
        const users = coaches.rows;
        const usersId = users.map(user => user.id);
        const clubs = await Clubs.findAll({
            where: {
                ownerId: usersId
            }
        })
        let coachList = [];
        for (let i = 0; i < users.length; i++) {
            let antrenor = users[i];
            let cluburi = clubs.filter(club => club.ownerId === users[i].id).map(club => {
                let name = club.name;
                return { name }
            })
            coachList.push({ antrenor, cluburi });
        }
        res.json(coachList);
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
}

exports.deleteListOfCoaches = async (req, res) => {
    try {
        const idList = req.body.idList;
        const coaches = await Users.findAll({
            where: {
                id: {
                    [Op.in]: idList
                },
                roleId: 2
            }
        });
        coaches.forEach(coach => coach.destroy());
        res.status(200).json();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getById = (req, res) => {
    Users.findOne({
        where: {
            id: req.params.coachId,
            roleId: 2
        },
        attributes: ['first_name', 'last_name', 'email', 'gender']
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'Coach not found!' });
            }
            else {
                return res.status(200).send({ user });
            }
        })
        .catch(err => {
            res.send({ error: err.message });
        })
}

exports.create = async (req, res ,next) => {
    try {
        const exists = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if(exists) {
            res.status(409).json({ message: 'Email already exists'});
            return;
        }
        const clubId = req.body.clubId ? req.body.clubId : null ;
        const password = Math.floor(Math.random()*9999999999) +1000000000;
        const userPassword = bcrypt.hashSync(`${password}`,10);
        const {first_name,last_name,email} = req.body;
        roleId = 2;
        const newUser = await Users.create({
            first_name,
            last_name,
            email,
            password: userPassword,
            roleId,
            profile_photo: 'images/no_image.png'
        });

        if(clubId) {
            const club = await Clubs.findOne({
                where: {
                    id: clubId
                }
            });
            club.ownerId = newUser.id;
            club.save();
        }
        const message = 
        `Your password is: ${password}.
        Your new club .`
        sendEmail(message,[email]);
        res.status(200).json();
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
}
exports.setId = (req, res, next) => {
    req.params.userId = req.params.coachId;
    next();
}

exports.setRole = (req, res, next) => {
    req.body.roleId = 2;
    next();
}

exports.createValidationRules = () => {
    return [
        body('first_name').exists().bail().isString().bail().notEmpty(),
        body('last_name').exists().bail().isString().bail().notEmpty(),
        body('email').exists().bail().isEmail(),
        body('clubId').optional().isInt()
    ]
}
