require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connected");
  })
  .catch(function () {
    console.log("No connected");
  });

module.exports = sequelize;
