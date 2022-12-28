import React, { useState } from "react";
import Teamcomponent from "./Team";
import "./QuizLayout.css";
import sound from "../assets/sound/wrong.mp3";

function QuizLayout() {
  const [words, setWords] = useState(["Han", "lever", "livet", "i", "baris"]);
  const [counter, setCounter] = useState(0);
  const teams = ["nagell", "gisle"];
  const audio = new Audio(sound);

  function shuffle(array: Array<number>) {
    let length = array.length,
      ri;
    while (length !== 0) {
      ri = Math.floor(Math.random() * length);
      length--;
      [array[length], array[ri]] = [array[ri], array[length]];
    }
    return array;
  }

  let currentcolors = shuffle([0, 0, 1, 1, 0]);
  const songs = [
    ["Chiketita", "tell", "me", "whats", "wrong"],
    ["Some", "say", "love", "it", "is"],
  ];

  function handleClick(id: number) {
    const box: HTMLElement | null = document.getElementById(id + "");
    if (box !== null) {
      if (currentcolors[id]) {
        box.style.backgroundColor = "red";
        audio.play();
      } else {
        box.style.backgroundColor = "blue";
      }
      box.innerHTML = words[id];
    }
  }

  function next(): void {
    currentcolors = shuffle(currentcolors);
    setWords(songs[counter]);
    setCounter(counter + 1);
  }

  return (
    <>
      <div className="boxes">
        {words.map((value, key) => (
          <p id={key + ""} key={value + ""} onClick={() => handleClick(key)}>
            {key + 1}
          </p>
        ))}
      </div>
      <div className="gameArea">
        <button onClick={() => next()}> Neste sang </button>
        <div className="points">
          {teams.map((value, key) => (
            <input className={value} type="number" key={key} />
          ))}
        </div>
        <div className="competitors">
          {teams.map((value, key) => (
            <Teamcomponent name={value} key={key} />
          ))}
        </div>
      </div>
    </>
  );
}

export default QuizLayout;
