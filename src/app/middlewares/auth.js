const jwt = require("jsonwebtoken");

const authConfig = require("../../config/Auth");

const User = require("../models/user");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, authConfig.secret, async (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });

    req.id = decoded.id;
    const user = await User.findOne({ where: { id: req.id } });
    if (!user) return res.status(400).send({ error: "User not found" });

    return next();
  });
};
