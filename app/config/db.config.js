module.exports = {
  HOST: "DB_HOST_HERE",
  USER: "DB_USER_HERE",
  PASSWORD: "DB_PASSWORD",
  DB: "DB_NAME_HERE",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};