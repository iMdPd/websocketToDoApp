const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const { tasks } = require("./db/db");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);

  socket.emit("updateData", tasks);

  socket.on("addTask", (newTask) => {
    console.log(`Oh, I've got new task from ${socket.id}`);
    tasks.push(newTask);
    socket.broadcast.emit("addTask", newTask);
  });

  socket.on("removeTask", (removeTask) => {
    console.log(`${socket.id} exactly removed task id: ${removeTask} `);
    tasks.splice(tasks.indexOf(removeTask), 1);
    socket.broadcast.emit("removeTask", removeTask);
  });
});
