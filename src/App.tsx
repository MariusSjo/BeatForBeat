import "./App.css";
import React, { useState } from "react";
import QuizLayout from "./components/QuizLayout";
import firebase from "firebase/compat/app";
import { Button, Input, Layout, QRCode, Spin, Typography } from "antd";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SongSelection from "./components/SongSelection";
//@ts-ignore
import ControlGame from "./components/ControlGame";
import { Content, Header } from "antd/es/layout/layout";
import { collection, doc, getDoc, query, where } from "firebase/firestore";

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
let qrRender = false;

function App() {
  const url = new URL(window.location.href);
  let gameID: any = localStorage.getItem("gameID");
  console.log(url.pathname);
  if (url.pathname.length < 2) {
    console.log(url.pathname.length);
    qrRender = true;
  } else {
    gameID = url.pathname.substring(1);
    localStorage.setItem("gameID", gameID);
  }
  const gamesRef = firestore.collection("games");
  if (gameID === null && !isGameCreated) {
    console.log("creating new game");
    isGameCreated = true;
    gameID = createNewGame(gamesRef);
    console.log(gameID);
  }

  //@ts-ignore

  const query1 = firestore
    .collection("games")
    .where(
      firebase.firestore.FieldPath.documentId(),
      "==",
      localStorage.gameID
    );
  const [game, loadingGame, error] = useCollectionData(query(query1));
  console.log(game, loadingGame, error);
  if (!loadingGame) {
    //@ts-ignore
    gamestarted = game[0].gameStarted;
    //@ts-ignore
    console.log(gamestarted);
  }

  return (
    <div className="App">
      {gamestarted && qrRender && <QuizLayout game={game} />}
      {qrRender && (
        <QRCode
          errorLevel="H"
          value={"http://localhost:3000/" + localStorage.getItem("gameID")}
          icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
      )}
      {!gamestarted && !qrRender && <ChatRoom />}
      {gamestarted && !qrRender && <ControlGame save={gamesRef} game={game} />}
    </div>
  );
}

export interface song {
  name: string;
  artist: string;
  lyrics: string;
  key: string;
}

async function createNewGame(save: any): Promise<any> {
  await save
    .add({
      revealed: [0, 0, 0, 0, 0, 0],
      songnumber: 0,
      revealClick: null,
      points1: 0,
      points2: 0,
      songs: [],
      gameStarted: false,
    })
    .then((docRef: any) => {
      console.log("Document written with ID: ", docRef.id);
      localStorage.setItem("gameID", docRef.id);
      return docRef.id;
    })
    .error((error: any) => {
      console.error("Error adding document: ", error);
      return error;
    });
}

function ChatRoom() {
  const [formValue, setFormValue] = useState([[""], [""], [""]]);
  const messagesRef = firestore.collection("messages");
  const gamesRef = firestore.collection("games");
  const query: any = messagesRef;
  // @ts-ignore
  const [fetchedSongs, loading] = useCollectionData<any>(query, {
    idField: "id",
  } as any);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formValue[2][0].split(" ").length < 5 ||
      formValue[2][0].split(" ").length > 6
    )
      alert("Please write between 5 and 6 words");
    else {
      await messagesRef
        .add({
          artist: formValue[0][0],
          name: formValue[1][0],
          lyrics: formValue[2][0],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        });
      setFormValue([[""], [""], [""]]);
    }
  };
  return (
    <>
      <Layout>
        <Header style={{ zIndex: 1, width: "100%" }}>
          <div
            style={{
              float: "left",
              width: 120,
              height: 31,
              margin: "16px 24px 16px 0",
            }}
          >
            <Typography style={{ color: "white", alignItems: "center" }}>
              {" "}
              Beat for beat
            </Typography>
          </div>
        </Header>
        <Content className="site-layout" style={{ padding: "0 20%" }}>
          <form onSubmit={addSong}>
            <label>Artist:</label>
            <Input
              type="text"
              value={formValue[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValue([[e.target.value], formValue[1], formValue[2]])
              }
            />
            <label>Title:</label>
            <Input
              required
              type="text"
              value={formValue[1]}
              onChange={(e) =>
                setFormValue([formValue[0], [e.target.value], formValue[2]])
              }
            />
            <label>lyrics (Write between 5 or 6 words)</label>
            <Input
              required
              type="text"
              value={formValue[2]}
              onChange={(e) =>
                setFormValue([formValue[0], formValue[1], [e.target.value]])
              }
            />
            <Button type="default" htmlType="submit">
              Send
            </Button>
          </form>
          <div>
            <h1>Choose songs</h1>
            {loading && <Spin size="large" />}
            {fetchedSongs && (
              <SongSelection song={fetchedSongs} saveToFirebase={gamesRef} />
            )}
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default App;
