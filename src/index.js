const express = require("express");
const cors = require("cors");

const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./swagger.yaml");

const sequelize = require("./database");

const products = require("./mocks/productsMock");
const user = require("./mocks/userMock");

const Product = require("./app/models/Product");
const User = require("./app/models/User");

sequelize.sync({ force: true }).then(() => {
  Product.bulkCreate(products);
  User.create(user);
});

const app = express();

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

require("./app/controllers/index")(app);

app.listen(3001);
