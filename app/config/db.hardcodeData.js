const db = require('../models/index');
const bcrypt = require('bcrypt');

let createRoleAdministrator = db.Role.create({
    name: 'Administrator',
    isAdmin: true
});
let createRoleCoach = db.Role.create({
  name: 'Coach',
  isAdmin: false
});
let createRoleAthlete = db.Role.create({
  name: 'Athlete',
  isAdmin: false
});
let createSportRunning = db.Sport.create({
  type:'Running'
});
let createSportCicling = db.Sport.create({
  type:'Cicling'
});
let createSportTeamsports = db.Sport.create({
  type:'TeamSports'
});
let createSportWeightlifting = db.Sport.create({
  type:'WeightLifting'
});

let createUserJohn = db.User.create({
    first_name: 'John',
    last_name: 'Andrew',
    email: 'johnandrew@andrew.com',
    password: bcrypt.hashSync('123456789', 10),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '1'
});

let createUserIulian = db.User.create({
  first_name: 'Udisteanu',
  last_name: 'Iulian-Elisei',
  email: 'udisteanu.iulian@outlook.com',
  password: bcrypt.hashSync('12345', 10),
  gender: 'm',
  height: 185,
  weight: 75,
  age: 23,
  roleId: '1'
});

let createUserBot = db.User.create({
  first_name: 'Iulian Bot',
  last_name: 'Iulian-Elisei',
  email: 'iulianbot@bot.com',
  password: bcrypt.hashSync('123456789', 10),
  gender: 'Male',
  height: 185,
  weight: 75,
  age: 23,
  roleId: '3',
  primarySportId: 1,
  secondarySportId: 2
});


let createUserMike = db.User.create({
    first_name: 'Mike',
    last_name: 'Barrely',
    email: 'mikebarrely@barrely.com',
    password: bcrypt.hashSync('12345', 10),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '2'
});

let createUserSarah = db.User.create({
    first_name: 'Sarah',
    last_name: 'Johnes',
    email: 'sarahjohnes@johnes.com',
    password: bcrypt.hashSync('123456789', 10),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '3'
});

let createUserValentin = db.User.create({
  first_name: 'Valentin',
  last_name: 'Stratan',
  email: 'valentin.stratan83@gmail.com',
  password: bcrypt.hashSync('12345', 10),
  gender: 'm',
  age: 25,
  roleId: '1'
});

let createUserMory = db.User.create({
  first_name: 'John',
  last_name: 'Sharp',
  email: 'john.sharp@sharp.com',
  password: bcrypt.hashSync('12345', 10),
  gender: 'm',
  age: 25,
  roleId: '2'
});

let createClubRunners = db.Club.create({
    name: 'RunningClub',
    sportId:1,
    ownerId:1
});
let createClubTeamers = db.Club.create({
    name: 'TeamClub',
    sportId:2,
    ownerId:1
});
let createClubLifters = db.Club.create({
    name: 'LiftClub',
    sportId:3,
    ownerId:2
});

let createEventMarathon = db.Event.create({
    clubId: 2,
    name: 'Marathon',
    date: '10.10.2021',
    time: '13:00',
    description: 'A running challange',  
    location: 'Suceava',
    radius: 10,
    sportId: 1,
    event_cover: null
});

let createEventTeamFest = db.Event.create({
    clubId: 1,
    name: 'TeamFest',
    date: '11.10.2021',
    time: '14:00',
    description: 'Win with your team',  
    location: 'Suceava',
    radius: 10,
    sportId: 2,
    event_cover: null
});

let createEventLiftUp = db.Event.create({
    clubId: 1,
    name: 'LiftUp',
    date: '12.10.2021',
    time: '15:00',
    description: 'Lift the world',  
    location: 'Suceava',
    radius: 10,
    sportId: 3,
    event_cover: null
});

let createWorkout1 = db.Workout.create({
  userId: 5,
  eventId: 1,
  duration: 1.30,
  heart_rate: 80,
  calories: 300,
  avg_speed: 15,
  distance: 10,
  workout_effectiveness: 'Effective'
});

module.exports = [
    // Production hardcoded data
    createRoleAdministrator, 
    createRoleCoach, 
    createRoleAthlete,
    createSportCicling,
    createSportRunning,
    createSportTeamsports,
    createSportWeightlifting,
    // Developement hardcoded data
    createMember1,
    createMember2,
    createMember3,
    createMember4,
    createUserJohn,
    createUserIulian,
    createUserMike,
    createUserSarah,
    createUserValentin,
    createUserMory,
    createClubRunners,
    createClubTeamers,
    createClubLifters ,
    createClubRunnersv2,
    createClubTeamersv2,
    createClubLiftersv2,
    createEventMarathon,
    createEventTeamFest,
    createEventLiftUp,
    createWorkout1
]