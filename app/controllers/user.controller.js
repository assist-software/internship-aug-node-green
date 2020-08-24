const db = require("../models");
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = db.User;
const Sport = db.Sport;
const {fn,col} =db.sequelize;
//create User method
exports.create = async (req, res, next) => {
    try {
        //check existance
        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (userExists) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(409).json({ message: 'Email already exists!!' });
            return;
        }


        //establishing roleId and create a new user
        const { first_name, last_name, email, password, gender, primarySportId, secondarySportId, height, weight, age } = req.body;
        if (!req.body.roleId) {
            req.body.roleId = 3;
        }
        const profile_photo = (req.file) ? req.file.path : 'images/no_image.jpg';
        //set profile photo
        const hashedPassword = bcrypt.hashSync(password, 10);
        User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            roleId: req.body.roleId,
            gender,
            primarySportId,
            secondarySportId,
            height,
            weight,
            age,
            profile_photo
        });

        res.status(200).json();
    }
    catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({ message: err.message });
    }
};

//update User method
exports.update = async (req, res) => {

    try {
        const id = req.params.userId;
        //check if user exists
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (user === null) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).json();

            return;
        }
        //verify profile_photo
        const profile_photo = (req.file) ? req.file.path : null;

        if (profile_photo !== null) {
            if (user.profile_photo && !user.profile_photo.includes('no_image')) {
                fs.unlinkSync(user.profile_photo);
            }
            user.profile_photo = profile_photo;
        }
        //for changing email
        if (req.body.email) {
            if (user.email !== req.body.email) {
                const userExists = await User.findOne({
                    where: {
                        email: req.body.email
                    }
                });

                if (userExists) {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                    res.status(409).json({ message: 'Email already exists!!' });
                    return;
                }
            }
        }
        //for changing password
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        //update user
        Object.keys(req.body).forEach(value => {
            if (value !== 'profile_photo') {
                user[value] = req.body[value];
            }
        });
        user.save();
        res.status(200).json();
    }
    catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({ message: err.message });
    }

};

//get User method
exports.get = async (req, res) => {
    try {
        const id = req.params.userId;
        //check if users exists
        const user = await User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });
        if (user) {

            if (user.profile_photo) {

                user['profile_photo'] = `${req.protocol}://${req.headers.host}/${user.profile_photo}`;

            }

            res.status(200).json(user);
        }
        else {
            res.status(404).json();
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

//delete User method

exports.delete = async (req, res) => {
    try {
        const id = req.params.userId;
        //check if user exists
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            //delete user
            if (user.profile_photo && !user.profile_photo.includes('no_image')) {
                fs.unlinkSync(user.profile_photo);
            }
            user.destroy();
            res.status(200).json();
        }
        else {
            res.status(404).json();
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

//search User by first_name or last_name

exports.search = async (req, res) => {
    try {
        const { search_query } = req.body;

        const users = await User.findAll();
        const newArray = users.filter(user => {
            return (user.first_name + ' ' + user.last_name).includes(search_query); // check if first_name + last_name containts search_query
        });
        res.status(200).send(newArray);

    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAllAthletes = async (req, res) => {
    try {
        const data = await User.findAll({
            where: {
                roleId: 3
            },
            include: [
                {
                    //required: true,
                    model: Sport,
                    as: 'primarySport',
                    attributes: ['type']
                },
                {
                    //required: true,
                    model: Sport,
                    as: 'secondarySport',
                    attributes: ['type']
                }
                

            ],
            
            attributes: ['first_name','last_name','gender','age',[fn('CONCAT',`${req.protocol}://${req.headers.host}/`,col('profile_photo')),'profile_photo']]
        });
        res.status(200).json(data);
    }
    catch(err) {
        res.status(500).send({ message: err.message });
    }
};

exports.validationRules = method => {
    switch (method) {
        case 'create': {
            return [
                body(['first_name', 'last_name', 'gender']).optional().isString(),
                body('email').exists().bail().isEmail(),
                body('password', 'invalid password').exists().bail().isString().bail().notEmpty().bail().custom((value, { req }) => {
                    if (value !== req.body.confirm_password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;
                }),
                body(['primarySportId', 'secondarySportId', 'age']).optional().isInt(),
                body(['height', 'weight']).optional().isFloat(),
                body('profile_photo').optional()

            ]
            break;
        }
        case 'update': {
            return [
                body(['first_name', 'last_name', 'gender']).optional().isString(),
                body('email').optional().isEmail(),
                body('password').optional().isString().notEmpty().custom((value, { req }) => {
                    if (value !== req.body.confirm_password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;
                }),
                body('roleId').optional().isInt(),
                body(['primarySportId', 'secondarySportId', 'age']).optional().isInt(),
                body(['height', 'weight']).optional().isFloat(),
                body('profile_photo').optional(),
                param('userId').isInt()
            ]
            break;
        }
        case 'search': {
            return [
                body('search_query').exists().withMessage(`search_query does not exist!!`).isString().withMessage('search_query must be a string')
            ]
            break;
        }
        case 'verifyUserId': {
            return [
                param('userId').isInt()
            ]
            break;
        }
    }
};

exports.validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const err = errors.array().map(object => {return  {msg: `${object.param}: ${object.msg}`}});
        res.status(422).json({ errors: err});
        return;
    }
    else {
        next();
        return;
    }
}