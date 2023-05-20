const express = require("express");
const socket = require("socket.io");
const { tasks } = require("./db/db");

const app = express();
const PORT = 8000;

const server = app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running...");
});

const io = socket(server);

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);

  socket.emit("updateData", tasks);

  socket.on("addTask", (newTask) => {
    console.log(`Oh, I've got new task from ${socket.id}`);
    tasks.push(newTask);
  });

  socket.on("removeTask", (removeTask) => {
    console.log(`${socket.id} exactly removed task ${removeTask.name} `);

    tasks.splice(tasks.indexOf(removeTask), 1);
  });
});
