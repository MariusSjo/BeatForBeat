import { Button } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import "./ControlGame.css";

function ControlGame(props: any) {
  const setValues = props.save.doc(sessionStorage.getItem("gameID"));
  const game = props.game[0];
  const songlength = game.songs[game.songnumber].lyrics.split(" ").length;
  const buttons = [];
  for (let index = 0; index < songlength; index++) {
    buttons.push(
      <Button onClick={() => revealBox(index)} size="large" key={index}>
        {" "}
        {index + 1}{" "}
      </Button>
    );
  }

  return (
    <div>
      {game.songs.length === game.songnumber + 1 && (
        <Button
          className="nextSong"
          type="primary"
          size="large"
          onClick={() => newGame()}
        >
          {" "}
          New game{" "}
        </Button>
      )}
      <Title className="nextSong">Game controller</Title>
      <div className="revealButtons">{songlength && buttons}</div>
      <div className="solution">
        <Title level={2}>Current song:</Title>
        {game.songs[game.songnumber] && (
          <p> 🕺 Artist: {game.songs[game.songnumber].artist} </p>
        )}
        <p> 🚀 Title: {game.songs[game.songnumber].name} </p>
        <p> 🕵️ Hidden: {game.songs[game.songnumber].lyrics} </p>
      </div>
      <div className="pointsection">
        <div>
          <Title level={2}>Team-Nagell</Title> <br></br>
          <Button
            type="primary"
            size="large"
            onClick={() => updatePoints(true, "team1")}
          >
            {" "}
            Points +{" "}
          </Button>
          <Button
            danger
            type="primary"
            size="large"
            onClick={() => updatePoints(false, "team1")}
          >
            {" "}
            Points -{" "}
          </Button>
        </div>
        <div>
          <Title level={2}>Team-Giske</Title> <br></br>
          <Button
            type="primary"
            size="large"
            onClick={() => updatePoints(true, "team2")}
          >
            {" "}
            Points +{" "}
          </Button>
          <Button
            danger
            type="primary"
            size="large"
            onClick={() => updatePoints(false, "team2")}
          >
            {" "}
            Points -{" "}
          </Button>
        </div>
      </div>
      {!(game.songs.length === game.songnumber + 1) && (
        <Button
          className="nextSong"
          type="primary"
          size="large"
          onClick={() => nextSong()}
        >
          {" "}
          Next song{" "}
        </Button>
      )}
    </div>
  );

  function updatePoints(increment: boolean, team: string): void {
    if (increment) {
      if (team === "team1") {
        setValues.update({ points1: game.points1 + 1 });
      } else {
        setValues.update({ points2: game.points2 + 1 });
      }
    } else {
      if (team === "team1") {
        setValues.update({ points1: game.points1 - 1 });
      } else {
        setValues.update({ points2: game.points2 - 1 });
      }
    }
  }
  function nextSong() {
    if (game.songs.length === game.songnumber + 1) {
      alert("Game is over!!");
      setValues.update({ songnumber: game.songnumber + 1 });
      setValues.update({ revealClick: null });
      return;
    } else {
      setValues.update({ revealClick: null });
      setValues.update({ songnumber: game.songnumber + 1 });
    }
  }

  function revealBox(index: number) {
    setValues.update({ revealClick: index });
  }

  function newGame() {
    setValues.update({ gameStarted: false });
    setValues.update({ songnumber: 0 });
    setValues.update({ revealClick: null });
    setValues.update({ points1: 0 });
    setValues.update({ points2: 0 });
  }
}
export default ControlGame;
