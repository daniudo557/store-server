const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("store-db", "user", "pass", {
  dialect: "sqlite",
  host: "./dev.sqlite",
});

module.exports = sequelize;
