import Button from "antd/es/button/button";
import Input from "antd/es/input/Input";
import React, { useState } from "react";
import SongSelection from "./SongSelection";
import { Content } from "antd/es/layout/layout";
import Spin from "antd/es/spin";
import Typography from "antd/es/typography";
import { useCollectionData } from "react-firebase-hooks/firestore";

function GameConfiguration(props: any) {
  const firestore = props.fire;
  console.log(firestore);
  const [formValue, setFormValue] = useState(["", "", ""]);
  const messagesRef = firestore.collection("messages");
  const gamesRef = firestore.collection("games");
  const query: any = messagesRef;
  const [fetchedSongs, loading] = useCollectionData<any>(query, {
    idField: "id",
  } as any);

  const addSong = async (submit: React.FormEvent) => {
    submit.preventDefault();
    if (
      formValue[2][0].split(" ").length < 5 ||
      formValue[2][0].split(" ").length > 6
    )
      alert("Please write between 5 and 6 words");
    else {
      await messagesRef.add({
        artist: formValue[0],
        name: formValue[1],
        lyrics: formValue[2],
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setFormValue(["", "", ""]);
    }
  };
  return (
    <>
      <Typography style={{ color: "black", alignItems: "center" }}>
        {" "}
        Beat for beat
      </Typography>

      <Content className="site-layout" style={{ padding: "0 5%" }}>
        <form onSubmit={addSong}>
          <label>Artist:</label>
          <Input
            type="text"
            value={formValue[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormValue([e.target.value, formValue[1], formValue[2]])
            }
          />
          <label>Title:</label>
          <Input
            required
            type="text"
            value={formValue[1]}
            onChange={(e) =>
              setFormValue([formValue[0], e.target.value, formValue[2]])
            }
          />
          <label>lyrics (Write between 5 or 6 words)</label>
          <Input
            required
            type="text"
            value={formValue[2]}
            onChange={(e) =>
              setFormValue([formValue[0], formValue[1], e.target.value])
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
    </>
  );
}

export default GameConfiguration;
