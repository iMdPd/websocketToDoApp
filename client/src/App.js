import io from "socket.io-client";
import shortid from "shortid";
import React, { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState({});
  const [listOfTasks, setListOfTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const addTask = (taskId, taskName) => {
    setListOfTasks((current) => [...current, { id: taskId, name: taskName }]);
  };

  const removeTask = (taskId) => {
    setListOfTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const handleTaskRemove = (id) => {
    removeTask(id);
    socket.emit("removeTask", id);
  };

  const handleAddNewTask = (e) => {
    e.preventDefault();
    const uniqueId = shortid();
    addTask(uniqueId, taskName);
    setTaskName("");

    socket.emit("addTask", {
      id: uniqueId,
      name: taskName,
    });
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on("updateData", (data) => {
      setListOfTasks(data);
    });

    socket.on("addTask", ({ id, name }) => {
      addTask(id, name);
    });

    socket.on("removeTask", (taksId) => {
      removeTask(taksId);
    });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {listOfTasks.map(({ id, name }) => {
            return (
              <li key={id} className="task">
                {name}
                <button
                  className="btn btn--red"
                  onClick={() => handleTaskRemove(id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <form id="add-task-form" onSubmit={(e) => handleAddNewTask(e)}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            onChange={(e) => setTaskName(e.target.value)}
            value={taskName}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
