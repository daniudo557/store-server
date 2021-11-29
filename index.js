const express = require("express");
const sequelize = require("./database");
const cors = require("cors");
const Todo = require("./Todo");

sequelize
  .sync({ force: true })
  .then(() => console.log("Database created successfully"));
const app = express();

app.use(cors());

app.use(express.json());

app.get("/todo", async (req, res) => {
  const todo = await Todo.findAll();

  res.send(todo);
});

app.get("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ where: { id: id } });

  res.send(todo);
});

app.post("/todo", async (req, res) => {
  const todo = await Todo.create(req.body);

  res.send(todo);
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({ where: { id } });

  todo.title = req.body.title;
  todo.description = req.body.description;
  todo.status = req.body.status;

  await todo.save();

  res.send(todo);
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;

  await Todo.destroy({ where: { id } });

  res.send("Todo deleted successfully");
});

app.listen(3001, () => {
  console.log("App is running");
});
