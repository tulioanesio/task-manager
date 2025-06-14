import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import api from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const { data: token } = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found!");
      } else if (err.response?.status === 401) {
        toast.error("Incorrect password.");
      } else {
        toast.error(err);
      }
    }
  }

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1E1E2E] h-[550px] p-8 w-full max-w-md rounded-md shadow-lg">
        <h1 className="text-center text-4xl mb-4">👋</h1>
        <h1 className="text-center text-[#E0E0E0] font-bold text-2xl mb-2">
          Olá, novamente!
        </h1>
        <p className="text-[#E0E0E0] text-md text-center">Entre na sua conta para visualizar suas tarefas</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 my-12">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#E0E0E0] text-md">E-mail</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="nome@exemplo.com"
              className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#2c729e] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#E0E0E0] text-md">Senha</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="senha123"
              className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#2c729e] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
              required
            />
          </div>
          <button
            type="submit"
            className="py-2 bg-[#3B3B5C] text-[#78BAFD] font-bold rounded-md hover:bg-[#4b4b6c] transition-colors"
          >
            Entrar
          </button>
          <ToastContainer theme="dark" />
          <p className="text-sm text-[#9CA3AF] text-center">
            Não possui uma conta?{" "}
            <Link to="/" className="text-[#4bb1f1] hover:text-white underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
