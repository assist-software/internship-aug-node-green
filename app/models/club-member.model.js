module.exports = (sequelize, Sequelize) => {

    const ClubMember = sequelize.define("clubmember", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        
        
    });
    return ClubMember;
}