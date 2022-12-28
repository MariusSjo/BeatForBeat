import "./App.css";
import React, { useState } from "react";
import QuizLayout from "./components/QuizLayout";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, getDocs } from "firebase/firestore";

import { GoogleAuthProvider, getAuth } from "firebase/auth";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASURMENT_ID,
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  console.log(process.env.REACT_APP_API_KEY);
  const [user] = useAuthState(auth as any);
  /* getMessages() */
  const [gameStarted, setGameStarted] = useState(false);
  return (
    <div className="App">
      {auth ? (
        <div>
          {" "}
          <ChatRoom /> <SignOut />{" "}
        </div>
      ) : (
        <SignIn />
      )}
      {gameStarted ? (
        <QuizLayout />
      ) : (
        <button onClick={() => setGameStarted(!gameStarted)}>Start</button>
      )}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    auth.signInWithRedirect(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query: any = messagesRef;
  const field: any = { idField: "id" };
  const [values, loading] = useCollectionData<any>(query, {
    idField: "id",
  } as any);
  console.log("what is this?", values, loading);

  return (
    <>
      <div>
        {loading && <h1>loading....</h1>}{" "}
        {values &&
          values.map((msg, index) => <ChatMessage key={index} message={msg} />)}
      </div>
    </>
  );
}

function ChatMessage(props: any) {
  const { text } = props.message;
  return <p key={text}>{text}</p>;
}

export default App;
