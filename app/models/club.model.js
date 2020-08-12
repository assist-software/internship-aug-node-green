
module.exports=(sequelize,Sequelize)=>{
    const Club = sequelize.define("club", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ownerId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    Club.sync({force:true}).then(()=>{
        Club.create({
            name:'Atletism',
            ownerId: 4
        })
    })
    return Club;
}