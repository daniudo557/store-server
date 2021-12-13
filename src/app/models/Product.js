const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../database");

class Product extends Model {}

Product.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    modelName: "product",
  }
);

module.exports = Product;
