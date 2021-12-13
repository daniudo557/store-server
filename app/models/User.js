const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../database");

class Product extends Model {}

Product.init(
  {
    userName: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

module.exports = Product;
