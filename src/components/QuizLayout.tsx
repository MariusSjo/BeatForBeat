import React, { useState } from "react";
import Teamcomponent from "./Team";
import "./QuizLayout.css";
import sound from "../assets/sound/wrong.mp3";

function QuizLayout(props: any) {
  const [currentSong, setCurrentSong] = useState(0);
  const [currentClick, setCurrentClick] = useState(null);
  if (props.game === undefined) {
    return <div>loading</div>;
  }
  const game = props.game[0];
  const songnumber = game.songnumber;
  const songs = game.songs.map((element: any) => {
    return element.lyrics.split(" ");
  });
  const [words, setWords] = useState(songs[game.songnumber]);
  const teams = ["nagell", "gisle"];
  const audio = new Audio(sound);
  let currentcolors = [0, 0, 1, 1, 0, 1];
  if (currentClick !== game.revealClick) {
    setCurrentClick(game.revealClick);
    handleClick(game.revealClick);
  }

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
    setCurrentSong(songnumber);
    setWords(songs[game.songnumber]);
  }

  if (currentSong !== songnumber) {
    next();
    currentcolors = shuffle(currentcolors);
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
          <input className="gisle" type="number" value={game.points1} />
          <input className="nagell" type="number" value={game.points2} />
        </div>
        <div className="competitors">
          <Teamcomponent name={"gisle"} />
          <Teamcomponent name={"nagell"} />
        </div>
      </div>
    </>
  );
}

export default QuizLayout;
