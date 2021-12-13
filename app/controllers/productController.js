const express = require("express");
const cors = require("cors");

const authMiddleware = require("../middlewares/auth");

const Product = require("../models/Product");
const User = require("../models/User");

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

const router = express();

router.use(authMiddleware);

router.use(cors());

router.use(express.json());

router.get("/", async (req, res) => {
  const product = await Product.findAll();

  res.send(product);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ where: { id: id } });

    res.send(product);
  } catch (err) {
    return res.status(400).send({ error: "Cannot find product" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findByPk(req.id);

    const superUser = user.role === 1;

    if (!superUser) {
      return res.status(400).send({ error: "User cannot create product" });
    }

    const newProduct = {
      ...req.body,
      image: getDefaultImage(req.body.category),
    };
    const product = await Product.create(newProduct);

    res.send(product);
  } catch (err) {
    return res.status(400).send({ error: "Cannot create product" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(req.id);

    const superUser = user.role === 1;

    if (!superUser) {
      return res.status(400).send({ error: "User cannot update product" });
    }

    const product = await Product.findOne({ where: { id } });

    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.category = req.body.category;
    product.rating = req.body.rating;

    await product.save();

    res.send(product);
  } catch (err) {
    return res.status(400).send({ error: "Product id not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(req.id);

    const superUser = user.role === 1;

    if (!superUser) {
      return res.status(400).send({ error: "User cannot delete product" });
    }

    await Product.destroy({ where: { id } });

    res.send("Product deleted successfully");
  } catch (err) {
    return res.status(400).send({ error: "Product id not found" });
  }
});

module.exports = (app) => app.use("/products", router);
