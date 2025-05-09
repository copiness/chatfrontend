import React, { useState, useEffect } from "react";
import { UserData } from "../context/UserContext";
import { ChatData } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loading";
import animationVideo from "../assets/mp.mp4"; // 👈 import your mp4 file here

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 mins timer
  const { verifyUser, btnLoading } = UserData();
  const { fetchChats } = ChatData();
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  };

  const handleResend = () => {
    setTimer(120); // Reset timer (optional: add resend logic)
  };

  return (
    <div className="h-screen w-full flex justify-center items-center relative overflow-hidden">
      {/* 🎞 Background Animation Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
      >
        <source src={animationVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 💡 Blur Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      <form
        onSubmit={submitHandler}
        className="z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center relative"
      >
        <h1 className="text-4xl font-extrabold text-[#432371] mb-2 tracking-wide">
          Verify Your Code
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Please enter the 6-digit code sent to your email. This code will
          expire in <span className="font-semibold">{formatTime(timer)}</span>
        </p>

        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-4 text-xl tracking-widest text-center border-2 border-[#e0d6ec] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#6A4E9E]"
        />

        <button
          type="submit"
          disabled={btnLoading || timer === 0}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
            timer === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6A4E9E] hover:bg-[#543580]"
          }`}
        >
          {btnLoading ? <LoadingSpinner /> : "Verify & Continue"}
        </button>

        {timer === 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Didn’t receive the code?{" "}
            <span
              onClick={handleResend}
              className="text-[#6A4E9E] font-medium cursor-pointer hover:underline"
            >
              Resend OTP
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Verify;
