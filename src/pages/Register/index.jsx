import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("/register", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      toast.success("User registered successfully", {
        autoClose: 500
      });

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("This email is already in use.");
      } else {
        toast.error(err);
      }
    }
  }

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1E1E2E] h-[620px] p-8 w-full max-w-md rounded-md shadow-lg">
        <h1 className="text-center text-4xl mb-4">🫰</h1>
        <h1 className="text-center text-[#E0E0E0] font-bold text-2xl mb-2">
          Cadastre-se
        </h1>
        <p className="text-[#E0E0E0] text-md text-center">Entre na sua conta para visualizar suas tarefas</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 my-8">

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[#E0E0E0] text-md">Nome</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Nome"
              className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#2c729e] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#E0E0E0] text-md">E-mail</label>
            <input
              ref={emailRef}
              type="text"
              placeholder="E-mail"
              className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#2c729e] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#E0E0E0] text-md">Senha</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="Senha"
              className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#2c729e] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 bg-[#3B3B5C] text-[#78BAFD] font-bold rounded-md hover:bg-[#4b4b6c] transition-colors"
          >
            Cadastre-se
          </button>
          <ToastContainer theme="dark" autoClose={5000} />

          <p className="text-sm text-[#9CA3AF] text-center">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="text-[#4bb1f1] hover:text-white underline"
            >
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
