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
    
    <main className="bg-[#121212] min-h-screen flex items-center justify-center px-4 py-10">
  <form className="bg-[#1E1E2E] w-full rounded-md p-6 shadow-lg">
    <div className="flex flex-col gap-4">
      <input
        id="taskInput"
        className="bg-[#2A2A3C] h-12 text-[#E0E0E0] px-4 py-2 rounded-md placeholder-[#4bb1f1] focus:placeholder-white outline-none"
        type="text"
        placeholder="Add a task"
        ref={inputTask}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div className="flex justify-end">
        <button
          id="btn-Add"
          type="button"
          className="h-11 w-32 border border-[#2C2C3A] bg-[#3B3B5C] rounded-sm font-bold transition duration-300"
          onClick={createTasks}
          disabled={!inputValue.trim()}
          style={{
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
            color: inputValue.trim() ? "#78BAFD" : "#605e5c",
          }}
        >
          Add
        </button>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {tasks.map((task) => (
        <div
          className="flex items-center justify-between bg-[#2A2A3C] p-4 rounded-md"
          key={task.id}
        >
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
                <span className="text-white font-semibold">{task.task}</span>
              </label>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => deleteTasks(task.id)}
            className="btn-Delete hover:bg-[#3B3B3B] rounded p-2 cursor-pointer"
          >
            <img
              src={Trash}
              style={{ width: "16px", height: "16px" }}
              alt="Delete"
            />
          </button>
        </div>
      ))}
    </div>
  </form>
</main>

  );
}

export default Home;
