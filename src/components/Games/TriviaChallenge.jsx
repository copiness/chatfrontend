import React, { useState } from "react";

const riddles = [
  { question: "What has keys but can't open locks?", answer: "keyboard" },
  { question: "I speak without a mouth. What am I?", answer: "echo" },
  { question: "What comes once in a minute, twice in a moment?", answer: "m" },
];

const RiddleWar = () => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const check = () => {
    if (input.trim().toLowerCase() === riddles[index].answer.toLowerCase()) {
      setFeedback("🎉 Correct!");
    } else {
      setFeedback(`😅 Nope! Answer: ${riddles[index].answer}`);
    }
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % riddles.length);
    setInput("");
    setFeedback("");
  };

  return (
    <div className="p-4">
      <p className="text-lg mb-2">{riddles[index].question}</p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Your Answer"
        className="border p-1"
      />
      <div className="mt-2 space-x-2">
        <button
          onClick={check}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Check
        </button>
        <button onClick={next} className="bg-gray-300 px-3 py-1 rounded">
          Next
        </button>
      </div>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
};

export default RiddleWar;
