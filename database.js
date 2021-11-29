const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todo-db", "user", "pass", {
  dialect: "sqlite",
  host: "./dev.sqlite",
});

module.exports = sequelize;
