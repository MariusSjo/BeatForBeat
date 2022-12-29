import "./App.css";
import React, { useState } from "react";
import QuizLayout from "./components/QuizLayout";
import firebase from "firebase/compat/app";
import { Spin } from "antd";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import SongSelection from "./components/SongSelection";

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

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  return (
    <div className="App">
      <ChatRoom />
      {gameStarted ? (
        <QuizLayout />
      ) : (
        <button onClick={() => setGameStarted(!gameStarted)}>Start</button>
      )}
    </div>
  );
}

export interface song {
  name: string;
  artist: string;
  lyrics: string;
  key: string;
}

function ChatRoom() {
  const [formValue, setFormValue] = useState([[""], [""], [""]]);
  const messagesRef = firestore.collection("messages");
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
      await messagesRef.add({
        artist: formValue[0][0],
        name: formValue[1][0],
        lyrics: formValue[2][0],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setFormValue([[""], [""], [""]]);
    }
  };
  return (
    <>
      {loading && <Spin size="large" />}
      <form onSubmit={addSong}>
        <label>Artist:</label>
        <input
          type="text"
          value={formValue[0]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValue([[e.target.value], formValue[1], formValue[2]])
          }
        />
        <label>Title:</label>
        <input
          required
          type="text"
          value={formValue[1]}
          onChange={(e) =>
            setFormValue([formValue[0], [e.target.value], formValue[2]])
          }
        />
        <label>lyrics:</label>
        <input
          required
          type="text"
          value={formValue[2]}
          onChange={(e) =>
            setFormValue([formValue[0], formValue[1], [e.target.value]])
          }
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h1>Choose songs</h1>
        {fetchedSongs && <SongSelection song={fetchedSongs} />}
      </div>
    </>
  );
}

export default App;
