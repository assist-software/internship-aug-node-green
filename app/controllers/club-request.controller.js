const db = require('../models/index');
const Clubs = db.Club;
const Users = db.User;
const ClubRequests = db.ClubRequest;


exports.create = (req, res) => {
    Clubs.findOne({
        where: {
            id: req.body.clubId
        }
    })
    .then(club => {
        if(!club) {
            res.status(404).send({message: 'Club not found'});
        }
        else {
            Users.findOne({
                where: {
                    id: req.body.userId
                }
            })
            .then(user => {
                if(!user) {
                    res.status(404).send({message: 'User not found'});
                }
                else {
                    db.ClubRequest.create({
                        userId: req.body.userId,
                        clubId: req.body.clubId
                    });
                    res.status(200).send({message: 'Club request created'});
                }
            })
            .catch(err => {
                res.send({error: err.message});
            })
        }
    })
    .catch(err => {
        res.send({error: err.message});
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