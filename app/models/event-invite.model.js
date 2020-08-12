module.exports = (sequelize , Sequelize) => {
    const EventInvite = sequelize.define("eventinvite",{
        email: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return EventInvite;
};