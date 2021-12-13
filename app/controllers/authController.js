const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const authConfig = require("../../config/auth");

const User = require("../models/User");

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 1814400,
  });
};

const router = express();

router.use(cors());

router.use(express.json());

router.post("/register", async (req, res) => {
  const { userName, email } = req.body;

  try {
    const isValidEmail = /^[^@\s]+@[^@\s.]+.[^@.\s]+(.[a-z]+)?$/.test(email);

    if (!isValidEmail) {
      return res.status(400).send({ error: "Email not valid" });
    }

    if (await User.findOne({ where: { email } })) {
      return res.status(400).send({ error: "User already exists" });
    }

    if (await User.findOne({ where: { userName } })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const hash = await bcrypt.hashSync(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hash,
      role: 0,
    });

    // Prevent to show this information on response
    user.password = undefined;

    return res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
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

module.exports = (app) => app.use("/auth", router);
