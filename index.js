const products = require("./defaultProducts");

const express = require("express");
const sequelize = require("./database");
const cors = require("cors");
const Product = require("./Product");
const User = require("./User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authConfig = require("./config/auth");

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 1814400,
  });
};

sequelize
  .sync({ force: true })
  .then(() => console.log("Database created successfully"))
  .then(() => {
    Product.bulkCreate(products);
  });
const app = express();

app.use(cors());

app.use(express.json());

function getDefaultImage(category) {
  switch (category) {
    case "men's clothing":
      return "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";
    case "men's clothing":
      return "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";
    case "jewelery":
      return "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";
    case "electronics":
      return "https://images.pexels.com/photos/306763/pexels-photo-306763.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";
    case "women's clothing":
      return "https://images.pexels.com/photos/601316/pexels-photo-601316.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  }
}

app.post("/user-register", async (req, res) => {
  const { userName, email } = req.body;

  try {
    const isValidEmail = /^[^@\s]+@[^@\s.]+.[^@.\s]+(.[a-z]+)?$/.test(email);

    if (!isValidEmail) {
      return res.status(400).send({ error: "Email not valid" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    if (await User.findOne({ userName })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const hash = await bcrypt.hashSync(req.body.password, 10);

    const user = await User.create({ ...req.body, password: hash, token });

    // Prevent to show this information on response
    user.password = undefined;
    user.token = undefined;
    user.role = undefined;

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

app.post("/authenticate", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ where: { userName } });

    if (!user) return res.status(400).send({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid password" });
    }

    user.password = undefined;

    res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    return res.status(400).send({ error: "Cannot login. Try again" });
  }
});

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
  const newProduct = {
    ...req.body,
    image: getDefaultImage(req.body.category),
  };
  const product = await Product.create(newProduct);

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
