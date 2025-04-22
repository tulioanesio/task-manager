import { useEffect, useState, useRef } from "react";
import "./style.css";
import api from "../../services/api";
import Trash from "../../assets/Trash.png";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputTask = useRef();

  async function getTasks() {
    const tasksFromApi = await api.get("/tasks");
    setTasks(tasksFromApi.data);
  }

  async function createTasks() {
    await api.post("/tasks", {
      task: inputTask.current.value,
    });

    setInputValue("");
    getTasks();
  }

  async function deleteTasks(id) {
    await api.delete(`/tasks/${id}`);
    getTasks();
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="container">
      <form>
        <input
          id="taskInput"
          className="inputTask"
          type="text"
          placeholder="Add a task"
          ref={inputTask}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          id="btn-Add"
          type="button"
          className="btn-Add"
          onClick={createTasks}
          disabled={!inputValue.trim()}
          style={{
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
            color: inputValue.trim() ? "#78BAFD" : "#605e5c",
          }}
        >
          Add
        </button>
      </form>

      {tasks.map((task) => (
        <div className="tasks" key={task.id}>
          <div className="task-content">
            <div className="checkbox-wrapper-15">
              <input
                className="inp-cbx"
                id={`cbx-${task.id}`}
                type="checkbox"
                style={{ display: "none" }}
              />
              <label className="cbx" htmlFor={`cbx-${task.id}`}>
                <span>
                  <svg width="12px" height="9px" viewBox="0 0 12 9">
                    <polyline points="1 5 4 8 11 1"></polyline>
                  </svg>
                </span>
                <span>{task.task}</span>
              </label>
            </div>
          </div>
          <button onClick={() => deleteTasks(task.id)} className="btn-Delete">
            <img
              src={Trash}
              style={{ width: "16px", height: "16px" }}
              alt="Delete"
            />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
