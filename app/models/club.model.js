
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
        }
        
    });
    Club.sync().then(()=>{
        Club.create({
            name:'Atletism'
        })
    })
    return Club;
}