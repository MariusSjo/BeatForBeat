import "./App.css";
import React, { useState } from "react";
import QuizLayout from "./components/QuizLayout";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  return (
    <div className="App">
      {gameStarted ? (
        <QuizLayout />
      ) : (
        <button onClick={() => setGameStarted(!gameStarted)}>Start</button>
      )}
    </div>
  );
}

export default App;
