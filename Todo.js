const { Model, DataTypes } = require("sequelize");
const sequelize = require("./database");

class Todo extends Model {}

Todo.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "todo",
  }
);

module.exports = Todo;
