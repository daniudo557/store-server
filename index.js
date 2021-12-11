const express = require("express");
const sequelize = require("./database");
const cors = require("cors");
const Product = require("./Product");

sequelize
  .sync({ force: true })
  .then(() => console.log("Database created successfully"));
const app = express();

app.use(cors());

app.use(express.json());

app.get("/products", async (req, res) => {
  const product = await Product.findAll();

  res.send(product);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ where: { id: id } });

  res.send(product);
});

app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);

  res.send(product);
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ where: { id } });

  product.title = req.body.title;
  product.price = req.body.price;
  product.description = req.body.description;
  product.category = req.body.category;
  product.rating = req.body.rating;

  await product.save();

  res.send(product);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  await Product.destroy({ where: { id } });

  res.send("Product deleted successfully");
});

app.listen(3001, () => {
  console.log("App is running");
});
