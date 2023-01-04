import React, { useState } from "react";
import Teamcomponent from "./Team";
import "./QuizLayout.css";
import sound from "../assets/sound/wrong.mp3";
let currentcolors = [0, 0, 1, 1, 0, 0];

function QuizLayout(props: any) {
  const [currentSong, setCurrentSong] = useState(0);
  const [currentClick, setCurrentClick] = useState(null);
  const game = props.game[0];
  const songnumber = game.songnumber;
  const songs = game.songs.map((element: any) => {
    return element.lyrics.split(" ");
  });
  const [words, setWords] = useState(songs[game.songnumber]);

  const audio = new Audio(sound);

  if (currentClick !== game.revealClick) {
    setCurrentClick(game.revealClick);
    handleClick(game.revealClick);
  }

  function handleClick(id: number) {
    const box: HTMLElement | null = document.getElementById(id + "");
    if (box !== null) {
      if (currentcolors[id]) {
        box.style.backgroundColor = "red";
        //@ts-ignore
        audio.play();
      } else {
        box.style.backgroundColor = "blue";
      }
      box.innerHTML = words[id];
    }
  }

  function next(): void {
    setCurrentSong(songnumber);
    setWords(songs[game.songnumber]);
  }

  if (currentSong !== songnumber) {
    next();
    shuffleColors();
  }

  return (
    <>
      <div className="boxes">
        {words &&
          words.map((value: string, key: number) => (
            <div key={value + key}>
              <p id={key + ""}>{key + 1}</p>
            </div>
          ))}
      </div>
      <div className="gameArea">
        <div className="points">
          <input
            className="gisle"
            type="number"
            readOnly
            value={game.points1}
          />
          <input
            className="nagell"
            type="number"
            readOnly
            value={game.points2}
          />
        </div>
        <div className="competitors">
          <Teamcomponent name={"gisle"} />
          <Teamcomponent name={"nagell"} />
        </div>
      </div>
    </>
  );

  function shuffleColors() {
    if (songs[game.songnumber].length === 5) {
      currentcolors = [0, 0, 1, 1, 0].sort(() => Math.random() - 0.5);
    } else {
      if (Math.random() > 0.5) {
        currentcolors = [1, 0, 0, 1, 0, 1].sort(() => Math.random() - 0.5);
      } else {
        currentcolors = [0, 0, 1, 1, 0, 0].sort(() => Math.random() - 0.5);
      }
    }
  }
}

export default QuizLayout;
