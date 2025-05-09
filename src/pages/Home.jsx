import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import { IoMdSend } from "react-icons/io";
import Lottie from "lottie-react";
import animationData from "../assets/Animation.json";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const {
    fetchResponse,
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
    speakWithVoice,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    const formattedPrompt = prompt.replace(/\n/g, "<br>");
    fetchResponse(formattedPrompt);
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col relative">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
          <Header />

          {loading ? (
            <LoadingBig />
          ) : (
            <div
              ref={messagecontainerRef}
              className="flex-1 max-h-[600px] overflow-y-auto thin-scrollbar p-4 mt-4 bg-white/5 backdrop-blur-md rounded-xl shadow-inner"
            >
              {messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i} className="mb-6">
                    {/* User Message */}
                    <div className="flex gap-3 items-start mb-4">
                      <div className="bg-blue-600 p-2 rounded-full text-white text-2xl">
                        <CgProfile />
                      </div>
                      <div
                        className="p-3 rounded-xl w-full"
                        style={{ backgroundColor: "#8d1a8d" }}
                      >
                        <pre className="whitespace-pre-wrap overflow-x-auto text-white text-base font-medium">
                          {e.question}
                        </pre>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex gap-3 items-start">
                      <div className="bg-green-600 p-2 rounded-full text-white text-2xl">
                        <FaRobot />
                      </div>
                      <div
                        className="p-3 rounded-xl w-full shadow"
                        style={{ backgroundColor: "#f3bf91" }}
                      >
                        <p
                          className="text-black text-base font-normal"
                          dangerouslySetInnerHTML={{ __html: e.answer }}
                        ></p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => speakWithVoice(e.answer)}
                            className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                          >
                            🔊 Play Voice
                          </button>
                          <button
                            onClick={() => window.speechSynthesis.cancel()}
                            className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                          >
                            🛑 Stop Voice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 mt-10">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    className="w-72 h-72"
                  />
                  <p className="text-lg text-gray-300 font-medium">
                    No chats yet. Start the conversation!
                  </p>
                </div>
              )}

              {newRequestLoading && <LoadingSmall />}
            </div>
          )}
        </div>

        {/* Enhanced 3D Prompt Input Form */}
        {chats && chats.length === 0 ? null : (
          <div className="w-full flex justify-center items-end px-4 py-6 z-50">
            <form
              onSubmit={submitHandler}
              className="w-full max-w-3xl mx-auto bg-[#1e1e2f]/80 border border-purple-700/40 rounded-2xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-md relative overflow-hidden group"
            >
              {/* Neon border animation */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-700 via-pink-600 to-yellow-500 opacity-20 blur-lg animate-pulse group-hover:opacity-30 transition-opacity duration-300"></div>

              <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
                <textarea
                  className="flex-grow bg-[#2b2b40]/90 text-white placeholder-gray-400 p-4 rounded-xl border border-gray-600 shadow-inner resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 h-[60px] sm:h-[80px]"
                  placeholder="✨ Ask something amazing..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center px-5 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-400 text-white rounded-xl shadow-md hover:shadow-purple-600/60 transform hover:scale-110 transition-all duration-300 text-2xl"
                >
                  <IoMdSend />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
