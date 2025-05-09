import React, { useState } from "react";

const questions = [
  { code: `console.log(typeof null);`, answer: "object" },
  {
    code: `let a = [1,2]; let b = a; b.push(3); console.log(a);`,
    answer: "[1,2,3]",
  },
  { code: `var x = 5; console.log(x++);`, answer: "5" },
];

const GuessOutput = () => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === questions[index].answer.toLowerCase()) {
      setResult("✅ Correct!");
    } else {
      setResult(`❌ Wrong! Answer: ${questions[index].answer}`);
    }
  };

  const next = () => {
    setIndex((index + 1) % questions.length);
    setInput("");
    setResult("");
  };

  return (
    <div className="p-4">
      <pre className="bg-gray-100 p-2 rounded">{questions[index].code}</pre>
      <input
        className="border mt-2 p-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Your Answer"
      />
      <div className="mt-2 space-x-2">
        <button
          onClick={checkAnswer}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
        <button onClick={next} className="bg-gray-300 px-3 py-1 rounded">
          Next
        </button>
      </div>
      {result && <div className="mt-2 font-semibold">{result}</div>}
    </div>
  );
};

export default GuessOutput;
