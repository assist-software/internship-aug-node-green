module.exports = {
  HOST: "localhost",
  USER: "elisei",
  PASSWORD: "Internship_123",
  DB: "internshipdb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};