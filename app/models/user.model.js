
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
            password: '12345',
            gender: 'm',
            height: 185,
            weight: 75,
            age: 25,
            roleId: '1',
            primarySportId: '1',
            secondarySportId: '2'
        })
    });
    return User;
}