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
});
