import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../../services/api";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const { data: token } = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("token", token);
      console.log(token);

      navigate("/home");
    } catch (err) {
      setMessage("Your password or email is incorrect. Please try again.");
      setError(true);
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

          {message && (
            <p className="text-sm font-semibold text-center text-red-500">
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm text-[#9CA3AF] text-center">
          Don’t have an account?{" "}
          <Link
            to="/"
            className="text-[#4bb1f1] hover:text-white underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
