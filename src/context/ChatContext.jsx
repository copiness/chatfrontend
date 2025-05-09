import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [createLod, setCreateLod] = useState(false);
  const [loading, setLoading] = useState(false);

  const escapeHtml = (str) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/\n\d+\.\s/g, "<br><b>$&</b>")
      .replace(/\n\s*-\s*/g, "<br>• ")
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang || "plaintext"}">${escapeHtml(
          code
        )}</code></pre>`;
      })
      .replace(/\n{2,}/g, "<br><br>")
      .replace(/\n/g, "<br>");
  };

  const fetchResponse = async () => {
    if (prompt.trim() === "") {
      toast.error("Write a prompt");
      return;
    }

    const userPrompt = prompt;
    setNewRequestLoading(true);
    setPrompt("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBpFjqFz9SJ8PGDnP1xFMJUr3ekGaGgbrQ`,
        {
          contents: [{ parts: [{ text: userPrompt }] }],
        }
      );

      const rawAnswer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      const formattedAnswer = formatMarkdown(rawAnswer);

      const message = {
        question: userPrompt,
        answer: formattedAnswer,
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);

      await axios.post(
        `${server}/api/chat/${selected}`,
        { question: userPrompt, answer: formattedAnswer },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setNewRequestLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setChats(data);
      setSelected(data[0]?._id || null);
    } catch (error) {
      console.error(error);
    }
  };

  const createChat = async () => {
    setCreateLod(true);
    try {
      await axios.post(
        `${server}/api/chat/new`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      fetchChats();
    } catch (error) {
      toast.error("Something went wrong while creating a new chat");
    } finally {
      setCreateLod(false);
    }
  };

  const fetchMessages = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error(error);
    }
  };

  const speakWithVoice = (htmlText) => {
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const plainText = htmlText
        .replace(/<pre><code[^>]*>[\s\S]*?<\/code><\/pre>/gi, "")
        .replace(/<br\s*\/?>/gi, ". ")
        .replace(/<[^>]+>/g, "")
        .replace(/[~`#^+=*]/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(plainText);

      // Use the first available English voice (no fancy selection)
      const voices = speechSynthesis.getVoices();
      const defaultVoice = voices.find((v) => v.lang.startsWith("en"));
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }

      utterance.lang = "en-US";
      utterance.rate = 1; // Normal speed
      utterance.pitch = 1; // Normal pitch

      // In case voices aren't ready yet
      if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = speechSynthesis.getVoices();
          const newVoice = updatedVoices.find((v) => v.lang.startsWith("en"));
          if (newVoice) utterance.voice = newVoice;
          speechSynthesis.speak(utterance);
        };
      } else {
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
        speakWithVoice,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
