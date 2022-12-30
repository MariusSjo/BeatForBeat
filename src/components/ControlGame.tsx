import { Button } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import "./ControlGame.css";

function ControlGame(props: any, props2: any) {
  const save = props.save;
  const game = props.game[0];

  return (
    <div>
      <Title>Game controller</Title>
      <div className="revealButtons">
        {game.revealed &&
          game.revealed.map((box: any, key: number) => {
            return (
              <Button danger={box} size="large" key={key}>
                {key + 1}
              </Button>
            );
          })}
      </div>
      <Title>Current song:</Title>
      <p> Artist: {game.songs[game.songnumber].artist} </p>
      <p> Title: {game.songs[game.songnumber].name} </p>
      <p> Hidden lyrics: {game.songs[game.songnumber].lyrics} </p>
      <div className="pointsection">
        <div>
          <title>Team 1</title> <br></br>
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
          <title>Team 2</title> <br></br>
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

      <Button type="primary" size="large">
        {" "}
        Next song{" "}
      </Button>
    </div>
  );

  function updatePoints(increment: boolean, team: string): void {
    const givepoints = save.doc(localStorage.getItem("gameID"));
    if (increment) {
      if (team === "team1") {
        givepoints.update({ points1: game.points1 + 1 });
      } else {
        givepoints.update({ points2: game.points2 + 1 });
      }
    } else {
      if (team === "team1") {
        givepoints.update({ points1: game.points1 - 1 });
      } else {
        givepoints.update({ points2: game.points2 - 1 });
      }
    }
  }
}
export default ControlGame;
