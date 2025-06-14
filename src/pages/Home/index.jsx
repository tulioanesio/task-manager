import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import Trash from "../../assets/Trash.png";
import Edit from "../../assets/Edit.png";
import Logout from "../../assets/Logout.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import ModalConfirmDelete from "../../components/ModalConfirmDelete";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [user, setUser] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputTask = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          name: decodedToken.name || "Aa",
          email: decodedToken.email || "aa@example.com",
        });
      } catch (error) {
        console.error("Erro ao decodificar o token JWT:", error);
        navigate("/login");
      }
      getTasks();
    }
  }, []);

  async function getTasks() {
    const tasksFromApi = await api.get("/tasks");
    setTasks(tasksFromApi.data);
  }

  async function postTasks() {
    if (!inputValue.trim()) return;
    await api.post("/tasks", { task: inputValue });
    setInputValue("");
    getTasks();
  }

  async function putTasks(id, newTaskValue) {
    if (!newTaskValue.trim()) return;
    await api.put(`/tasks/${id}`, { task: newTaskValue });
    setEditingTaskId(null);
    getTasks();
  }

  async function deleteTasks(id) {
    await api.delete(`/tasks/${id}`);
    getTasks();
  }

  async function toggleTaskDone(id, currentStatus) {
    await api.patch(`/tasks/${id}`, { isDone: !currentStatus });
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

  function handleOpenModal(id) {
    setTaskToDelete(id);
    setIsModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (taskToDelete !== null) {
      await deleteTasks(taskToDelete);
    }
    setIsModalOpen(false);
    setTaskToDelete(null);
  }

  function handleCancelDelete() {
    setIsModalOpen(false);
    setTaskToDelete(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    postTasks();
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-[#1E1E2E] flex-col justify-between py-6 px-4 fixed left-0 top-0 bottom-0">
        <div>
          <h2 className="text-lg font-bold mb-4">To-Do List | UNISUL</h2>

          {user && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4bb1f1] text-white text-xl font-bold mr-4">
                {(() => {
                  const names = user.name.trim().split(" ");
                  const first = names[0]?.[0] || "";
                  const last = names.length > 1 ? names[names.length - 1][0] : "";
                  return (first + last).toUpperCase();
                })()}
              </div>
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <small className="text-sm text-gray-400">{user.email}</small>
              </div>
            </div>
          )}

          {
            tasks.length > 0 && (
              <div className="flex flex-col my-20">
                <div className="border h-60 bg-[#2A2A3C] rounded-md p-4 mb-4">
                  <h2 className="text-lg font-bold mb-2">Tarefas pendentes</h2>
                  <div className="mt-4">
                    <div className="w-full bg-[#3B3B5C] rounded-full h-3">
                      <div
                        className="bg-[#4bb1f1] h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.isDone).length / tasks.length) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      <span>
                        {tasks.length === 0
                          ? "0% concluído"
                          : `${Math.round((tasks.filter(t => t.isDone).length / tasks.length) * 100)}% concluído`}
                      </span>
                      <span>
                        {tasks.filter(t => t.isDone).length} de {tasks.length} concluídas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#E0E0E0] border border-[#2C2C3A] bg-[#3B3B5C] rounded hover:bg-[#4b4b6c]"
        >
          <img src={Logout} style={{ width: "16px", height: "16px" }} alt="Logout" />
          Sair
        </button>
      </aside>

      {/* Main */}
      <main className={`flex-1 md:ml-64 px-4 sm:px-6 md:px-12 py-10 w-full`}>
        <div className="flex justify-end mb-4 md:hidden">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#E0E0E0] border border-[#2C2C3A] bg-[#3B3B5C] rounded hover:bg-[#4b4b6c]"
          >
            <img src={Logout} style={{ width: "16px", height: "16px" }} alt="Logout" />
            Sair
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-4">Minhas Tarefas</h1>

        <form onSubmit={handleSubmit} className="bg-[#1E1E2E] rounded-md p-6 shadow-lg">
          <div className="flex flex-col gap-4">
            <input
              id="taskInput"
              className="bg-[#2A2A3C] h-12 text-[#E0E0E0] px-4 py-2 rounded-md placeholder-[#4bb1f1] focus:placeholder-white outline-none"
              type="text"
              placeholder="Adicione uma nova tarefa"
              autoComplete="off"
              ref={inputTask}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                id="btn-Add"
                type="submit"
                className="h-11 w-46 border border-[#2C2C3A] bg-[#3B3B5C] rounded-sm font-bold transition duration-300"
                disabled={!inputValue.trim()}
                style={{
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                  color: inputValue.trim() ? "#78BAFD" : "#605e5c",
                }}
              >
                Cadastrar tarefa
              </button>
            </div>
          </div>

          {tasks.length > 0 && (
            <p>{tasks.length} tarefas no total</p>
          )}

          <div className="mt-6 space-y-4 md:max-h-[450px] md:overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-[#2A2A3C] p-4 rounded-md"
              >
                <div>
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
                          autoFocus
                          onBlur={(e) => putTasks(task.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              putTasks(task.id, e.currentTarget.value);
                            }
                            if (e.key === "Escape") {
                              setEditingTaskId(null);
                            }
                          }}
                          className="bg-transparent text-white border-b border-white focus:outline-none"
                        />
                      ) : (
                        <span className={`font-semibold ${task.isDone ? "line-through opacity-50" : ""}`}>
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
                    <img src={Edit} style={{ width: "16px", height: "16px" }} alt="Edit" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenModal(task.id);
                    }}
                    className="hover:bg-[#3B3B3B] rounded p-2 cursor-pointer"
                  >
                    <img src={Trash} style={{ width: "16px", height: "16px" }} alt="Delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </main>

      {isModalOpen && (
        <ModalConfirmDelete
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default Home;
