module.exports = (sequelize, Sequelize) => {

    const ClubRequest = sequelize.define("clubrequest", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.INTEGER
        }
        
    });
    return ClubRequest;
}