import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import Trash from "../../assets/Trash.png";
import Edit from "../../assets/Edit.png";
import Logout from "../../assets/Logout.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const inputTask = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getTasks();
    }
  }, []);

  async function getTasks() {
    const tasksFromApi = await api.get("/tasks");
    setTasks(tasksFromApi.data);
  }

  async function postTasks() {
    await api.post("/tasks", {
      task: inputTask.current.value,
    });

    setInputValue("");
    getTasks();
  }

  async function putTasks(id, newTaskValue) {
    await api.put(`/tasks/${id}`, { task: newTaskValue });
    setEditingTaskId(null);
    getTasks();
  }

  async function deleteTasks(id) {
    await api.delete(`/tasks/${id}`);
    getTasks();
  }

  async function toggleTaskDone(id, currentStatus) {
    await api.patch(`/tasks/${id}`, {
      isDone: !currentStatus,
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isDone: !currentStatus } : task
      )
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="bg-[#121212] min-h-screen flex items-center justify-center px-4 py-10">
      <header className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-[#78BAFD] border border-[#2C2C3A] bg-[#3B3B5C] rounded hover:bg-[#4b4b6c] transition-colors cursor-pointer"
        >
          <img
            src={Logout}
            style={{ width: "16px", height: "16px" }}
            alt="Logout"
          />
        </button>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1E1E2E] w-full rounded-md p-6 shadow-lg"
      >
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
              type="submit"
              className="h-11 w-32 border border-[#2C2C3A] bg-[#3B3B5C] rounded-sm font-bold transition duration-300"
              onClick={postTasks}
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
                    checked={task.isDone}
                    type="checkbox"
                    style={{ display: "none" }}
                    onChange={() => toggleTaskDone(task.id, task.isDone)}
                  />
                  <label className="cbx" htmlFor={`cbx-${task.id}`}>
                    <span>
                      <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1"></polyline>
                      </svg>
                    </span>
                    {editingTaskId === task.id ? (
                      <input
                        defaultValue={task.task}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            putTasks(task.id, e.target.value);
                          }
                        }}
                        onBlur={() => setEditingTaskId(null)}
                        className="bg-transparent text-white border-b border-white focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`text-white font-semibold ${
                          task.isDone ? "line-through opacity-50" : ""
                        }`}
                      >
                        {task.task}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTaskId(task.id)}
                  className="hover:bg-[#3B3B3B] rounded p-2 cursor-pointer"
                >
                  <img
                    src={Edit}
                    style={{ width: "16px", height: "16px" }}
                    alt="Edit"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => deleteTasks(task.id)}
                  className="hover:bg-[#3B3B3B] rounded p-2 cursor-pointer"
                >
                  <img
                    src={Trash}
                    style={{ width: "16px", height: "16px" }}
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </main>
  );
}

export default Home;
