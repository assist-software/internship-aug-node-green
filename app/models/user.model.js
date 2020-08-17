var bcrypt = require('bcryptjs');
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
       id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
       },
       first_name: {
        type: Sequelize.STRING,
        allowNull: true
       },
       last_name: {
        type: Sequelize.STRING,
        allowNull: true
       },
       email: {
        type: Sequelize.STRING,
        allowNull: false
       },
       password: {
        type: Sequelize.STRING,
        allowNull: false
       },
       gender: {
        type: Sequelize.STRING,
        allowNull: true
       },
       height: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       weight: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       age: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       profile_photo: {
        type: Sequelize.BLOB,
        allowNull: true
       }
    });
    User.sync().then(() => {
        User.create({
            first_name: 'John',
            last_name: 'Andrew',
            email: 'johnandrew@andrew.com',
            password: bcrypt.hashSync('12345', 8),
            gender: 'm',
            height: 185,
            weight: 75,
            age: 25,
            roleId: '1',
            //primarySportId: '1',
            //secondarySportId: '2'
        })
    });

    User.sync().then(() => {
        User.create({
            first_name: 'Mike',
            last_name: 'Barrely',
            email: 'mikebarrely@barrely.com',
            password: bcrypt.hashSync('12345', 8),
            gender: 'm',
            height: 185,
            weight: 75,
            age: 25,
            roleId: '2',
            //primarySportId: '1',
            //secondarySportId: '2'
        })
    });

    User.sync().then(() => {
        User.create({
            first_name: 'Sarah',
            last_name: 'Johnes',
            email: 'sarahjohnes@johnes.com',
            password: bcrypt.hashSync('12345', 8),
            gender: 'm',
            height: 185,
            weight: 75,
            age: 25,
            roleId: '3',
            //primarySportId: '1',
            //secondarySportId: '2'
        })
    });
    return User;
};