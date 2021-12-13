const express = require("express");
const cors = require("cors");

const sequelize = require("./database");

const products = require("./defaultProducts");

const Product = require("./app/models/Product");
const User = require("./app/models/User");

sequelize.sync({ force: true }).then(() => {
  Product.bulkCreate(products);
  User.create({
    userName: "admin",
    fullName: "Admin",
    password: "$2b$10$HsTr7B7wngjKqiTERFg5MeovT9tFxqrWg6KZHL.5Sxf.uai1Kb4k2",
    email: "admin@admin.com",
    role: 1,
  });
});

const app = express();

app.use(cors());

app.use(express.json());

require("./app/controllers/index")(app);

app.listen(3001);
