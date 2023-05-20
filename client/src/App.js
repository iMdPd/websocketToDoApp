import io from "socket.io-client";
import shortid from "shortid";
import React, { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on("updateData", (data) => {
      setTasks(data);
    });
  }, []);

  const handleTaskRemove = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const handleAddNewTask = (e) => {
    e.preventDefault();
    setTasks((current) => [...current, { id: shortid(), name: inputValue }]);
    setInputValue("");
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(({ name, id }) => {
            return (
              <li key={id} className="task">
                {name}{" "}
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
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
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
