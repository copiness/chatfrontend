import React, { useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Section - Dark Brown Theme */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-gradient-to-br from-[#4E342E] to-[#3E2723] text-white">
        <div className="w-44 h-44 mb-6 rounded-full overflow-hidden shadow-xl border-4 border-[#D7CCC8]">
          <img
            src="/img/prof.png"
            alt="Professional"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-[#FFF3E0] text-center">
          Welcome Back, Professional!
        </h2>
        <p className="text-lg text-[#D7CCC8] text-center">
          Join a thriving network of:
        </p>
        <ul className="mt-4 space-y-2 text-[#FFE0B2] font-medium text-center">
          <li>👨‍💻 Developers</li>
          <li>🧑‍🏫 Mentors</li>
          <li>📊 Analysts</li>
          <li>🧑‍🎨 Designers</li>
          <li>📚 Educators</li>
        </ul>
      </div>

      {/* Right Section - Light Background with Contrast */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-[#F5F5DC]">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-[#3E2723]">
            Login
          </h2>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-[#5D4037] mb-2 font-semibold"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-[#FBE9E7] text-[#3E2723] border border-[#D7CCC8] placeholder-[#A1887F] focus:ring-2 focus:ring-[#8D6E63] outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={btnLoading}
            className="w-full py-3 mt-2 bg-[#6D4C41] hover:bg-[#5D4037] text-white font-semibold rounded-md transition duration-200"
          >
            {btnLoading ? <LoadingSpinner /> : "Login"}
          </button>

          <p className="text-center text-sm text-[#795548] mt-4">
            Don’t have an account?{" "}
            <span className="text-[#3E2723] underline cursor-pointer hover:text-black">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
