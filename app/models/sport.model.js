module.exports=(sequelize,Sequelize)=>{
    const Sport=sequelize.define("sport",{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        type:{
            type:Sequelize.STRING
        }
    });
<<<<<<< HEAD
    Sport.sync({force:true}).then(()=>{
=======
    
    Sport.sync().then(()=>{
>>>>>>> bc69a5742830f7a43e7f598d3a53e8cf6c10b305
        Sport.create({
            type:'Running'
        });
        Sport.create({
            type:'Cicling'
        });
        Sport.create({
            type:'TeamSports'
        });
        Sport.create({
            type:'WeightLifting'
        });

    })
    return Sport;
}
