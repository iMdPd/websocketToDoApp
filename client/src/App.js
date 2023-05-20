import io from "socket.io-client";
import React, { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on("updateData", (data) => {
      setTasks(data);
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
          {tasks.map(({ name, id }) => {
            return (
              <li key={id} className="task">
                {name} <button className="btn btn--red">Remove</button>
              </li>
            );
          })}
        </ul>

        <form id="add-task-form">
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
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
