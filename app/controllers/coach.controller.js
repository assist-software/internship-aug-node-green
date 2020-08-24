const db = require("../models");
const { ClubRequest } = require("../models");
const { response } = require("express");
const { get } = require("./user.controller");
const Users = db.User;
const Clubs = db.Club;
const Op = db.Sequelize.Op;
const sendEmail = require('../utils/email.utils.js');

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
        const clubId = req.body.clubId;
        const pass = Math.floor(Math.random() * 9999999999) + 1000000000;
        req.body.password = `${pass}`;
        req.body.confirm_password = req.body.password;
        next();
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.addOwner = async (req,res) => {
    if (req.body.clubId) {
        const club = await Clubs.findOne({
            where: {
                id: clubId
            }
        });

        if (!club) {
            res.status(404).json({ error: 'Club not found' });
            return;
        }
        const user = await Users.findOne({
            where: {
                email: email
            }
        });
        club.ownerId = user.id;
        club.save();
    }
    const mesaj = `Parola dumneavostra este: ${pass}.`;
    sendEmail(mesaj, [email]);
}

exports.setId = (req, res, next) => {
    req.params.userId = req.params.coachId;
    next();
}

exports.setRole = (req, res, next) => {
    req.body.roleId = 2;
    next();
}
