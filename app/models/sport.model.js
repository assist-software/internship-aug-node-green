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
    Sport.sync({force:true}).then(()=>{
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
