import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";
import { FaCommentDots } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { chats, createChat, createLod, setSelected, deleteChat } = ChatData();
  const { logoutHandler } = UserData();

  const deleteChatHandler = (id) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSidebar();
  };

  return (
    <div
      className={`fixed inset-0 bg-[#0f0f1a]/80 backdrop-blur-[8px] text-white p-6 shadow-2xl transition-all transform md:relative md:translate-x-0 md:w-[310px] md:block z-50 border-r border-white/10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Mobile Close Button */}
      <button
        className="md:hidden text-4xl mb-6 text-rose-400 hover:scale-110 transition-all"
        onClick={toggleSidebar}
      >
        <IoIosCloseCircle />
      </button>

      {/* Sidebar Title */}
      <div className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]">
        <FaCommentDots className="inline-block mr-2 animate-bounce" />
        Chat<span className="text-yellow-300">Bot</span>
      </div>

      {/* Create New Chat */}
      <div className="mb-8">
        <button
          onClick={createChat}
          className="w-full py-3 px-4 bg-gradient-to-br from-[#4b0aff] via-[#ff00d4] to-[#ff9900] rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-pink-500/40 animate-glow"
        >
          {createLod ? <LoadingSpinner /> : "🚀 Start a Chat"}
        </button>
      </div>

      {/* Chat List Header */}
      <p className="text-sm text-gray-300 mb-2 uppercase tracking-widest font-semibold">
        Recent Conversations
      </p>

      {/* Chat Items */}
      <div className="max-h-[450px] overflow-y-auto pr-2 space-y-4 thin-scrollbar">
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => clickEvent(chat._id)}
              className="relative bg-gradient-to-br from-[#2b2b3c]/90 to-[#1a1a2f]/90 backdrop-blur-md rounded-xl p-4 flex justify-between items-center transition-all transform hover:scale-[1.03] hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] cursor-pointer border border-white/10"
            >
              <span className="truncate max-w-[180px] text-sm font-medium text-white">
                {chat.latestMessage?.slice(0, 38) || "Untitled"}...
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChatHandler(chat._id);
                }}
                className="text-rose-400 hover:text-red-600 text-xl transition-all"
              >
                <MdDelete />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No chats yet</p>
        )}
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={logoutHandler}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-xl text-white font-semibold shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:scale-105 transition-all"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
