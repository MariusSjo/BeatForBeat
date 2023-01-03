import "./App.css";
import React, { useState } from "react";
import QuizLayout from "./components/QuizLayout";
import firebase from "firebase/compat/app";
import { Button, Input, Layout, QRCode, Spin, Typography } from "antd";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ControlGame from "./components/ControlGame";
import GameConfiguration from "./components/GameConfiguration";
import { query } from "firebase/firestore";

let isGameCreated = false;

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASURMENT_ID,
});

const firestore = firebase.firestore();
let gamestarted = false;
let isDesktop = false;

function App() {
  const url = new URL(window.location.href);
  let gameID: any = sessionStorage.getItem("gameID");
  if (url.pathname.length < 2) {
    isDesktop = true;
  } else {
    gameID = url.pathname.substring(1);
    sessionStorage.setItem("gameID", gameID);
  }
  const gamesRef = firestore.collection("games");
  if (gameID === null && !isGameCreated) {
    isGameCreated = true;
    gameID = createNewGame(gamesRef);
  }
  const specificGame = gamesRef.where(
    firebase.firestore.FieldPath.documentId(),
    "==",
    sessionStorage.gameID
  );
  const [game, loadingGame, error] = useCollectionData(query(specificGame));
  if (!loadingGame) {
    if (game?.length === 0) {
      console.error(error);
      sessionStorage.removeItem("gameID");
      document.location.href = "/";
    } else {
      if (game !== undefined) {
        gamestarted = game[0].gameStarted;
      }
    }
  }

  return (
    <div className="App">
      {gamestarted && isDesktop && <QuizLayout game={game} />}
      {isDesktop && !gamestarted && (
        <div className="centercontent">
          {" "}
          <h1>
            Ivar Dyrhaug scanner QR-koden med mobilen og kobler denne skjermen
            til en storskjerm!
          </h1>
          <QRCode
            errorLevel="H"
            value={
              process.env.REACT_APP_REDIRECTURL! +
              sessionStorage.getItem("gameID")
            }
          />
        </div>
      )}
      {!gamestarted && !isDesktop && <GameConfiguration fire={firestore} />}
      {gamestarted && !isDesktop && <ControlGame save={gamesRef} game={game} />}
    </div>
  );
}

async function createNewGame(save: any): Promise<any> {
  await save
    .add({
      songnumber: 0,
      revealClick: null,
      points1: 0,
      points2: 0,
      songs: [],
      gameStarted: false,
    })
    .then((docRef: any) => {
      sessionStorage.setItem("gameID", docRef.id);
      location.reload();
    })
    .error((error: any) => {
      console.error("Error adding document: ", error);
      return error;
    });
}

export default App;
