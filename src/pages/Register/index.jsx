import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
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

      setMessage("User registered successfully");
      setError(false);

      navigate("/home");
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage("This email is already in use.");
      } else {
        setMessage("Error registering user.");
      }

      setError(true);
    }
  }

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#1E1E2E] p-8 w-full max-w-md rounded-md shadow-lg">
        <h1 className="text-center text-[#E0E0E0] font-bold text-2xl mb-6">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            className="px-3 py-2 rounded-md bg-[#2A2A3C] text-[#E0E0E0] placeholder-[#4bb1f1] focus:outline-none focus:ring-2 focus:ring-[#4bb1f1]"
            required
          />

          <input
            ref={emailRef}
            type="text"
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
            Submit
          </button>

          {message && (
            <p
              className={`text-sm font-semibold text-center ${
                error ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-sm text-[#9CA3AF] text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4bb1f1] hover:text-white underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
