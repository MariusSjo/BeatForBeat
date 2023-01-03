import "./App.css";
import React, { useEffect, useState } from "react";
import QuizLayout from "./components/QuizLayout";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ControlGame from "./components/ControlGame";
import GameConfiguration from "./components/GameConfiguration";
import { query } from "firebase/firestore";
import DesktopView from "./components/DesktopView";

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
const url = new URL(window.location.href);
let currentGameQuery: any;

function App() {
  const [gameID, setGameID] = useState(sessionStorage.getItem("gameID"));
  const isDesktop = checkDevice();
  const gamesRef = firestore.collection("games");
  if (gameID !== null) {
    currentGameQuery = gamesRef.where(
      firebase.firestore.FieldPath.documentId(),
      "==",
      gameID
    );
  }
  const [game, loadingGame] = useCollectionData(query(currentGameQuery));
  if (!loadingGame) {
    if (game?.length === 0) {
      console.error("should be redrieted home");
      sessionStorage.removeItem("gameID");
      document.location.href = "/";
    } else {
      if (game !== undefined) {
        //@ts-ignore
        gamestarted = game[0].gameStarted;
      }
    }
  }

  async function CheckForActiveGame() {
    const id = await getGameID();
    //@ts-ignore
    setGameID(id);
    sessionStorage.setItem("gameID", id!);
  }

  useEffect(() => {
    CheckForActiveGame();
  }, []);

  return (
    <div className="App">
      {isDesktop ? (
        gamestarted ? (
          <QuizLayout game={game} />
        ) : (
          <DesktopView props={gameID} />
        )
      ) : gamestarted ? (
        <ControlGame save={gamesRef} game={game} />
      ) : (
        <GameConfiguration fire={firestore} />
      )}
    </div>
  );

  function checkDevice(): boolean {
    return url.pathname.length < 2;
  }

  async function getGameID(): Promise<string | null> {
    if (isDesktop) {
      const gameIDSessionstorage = sessionStorage.getItem("gameID");
      if (gameIDSessionstorage === null) {
        return await createGameID();
      }
      return gameIDSessionstorage;
    } else {
      sessionStorage.setItem("gameID", url.pathname.substring(1));
      return url.pathname.substring(1);
    }
  }

  async function createGameID() {
    const document = await createNewGame();
    setGameID(document.id);
    sessionStorage.setItem("gameID", gameID!);
    return document.id;
  }

  async function createNewGame(): Promise<any> {
    return await gamesRef.add({
      songnumber: 0,
      revealClick: null,
      points1: 0,
      points2: 0,
      songs: [],
      gameStarted: false,
    });
  }
}
export default App;
