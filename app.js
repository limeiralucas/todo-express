const express = require("express");
const app = express();
const mongodb = require("./mongodb/mongodb.connect");

mongodb.connect();

const todoRoutes = require("./routes/todo.routes");

app.use(express.json());
app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message });
});

app.get("/", (request, reply) => reply.send({ hello: "world" }));

module.exports = app;