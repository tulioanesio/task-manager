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
        toast.error("Unexpected error. Please try again.");
      }
    }
  }

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1E1E2E] p-8 w-full max-w-md rounded-md shadow-lg">
        <h1 className="text-center text-[#E0E0E0] font-bold text-2xl mb-6">
          Log In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#4bb1f1] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
            required
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#4bb1f1] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
            required
          />
          <button
            type="submit"
            className="py-2 bg-[#3B3B5C] text-[#78BAFD] font-bold rounded-md hover:bg-[#4b4b6c] transition-colors"
          >
            Log in
          </button>
          <ToastContainer theme="dark"/>
        </form>

        <p className="mt-4 text-sm text-[#9CA3AF] text-center">
          Don’t have an account?{" "}
          <Link to="/" className="text-[#4bb1f1] hover:text-white underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
