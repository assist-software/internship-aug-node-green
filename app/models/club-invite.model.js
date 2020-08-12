module.exports = (sequelize, Sequelize) => {

    const ClubInvite = sequelize.define("clubinvite", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
    });
    
    return ClubInvite;
}