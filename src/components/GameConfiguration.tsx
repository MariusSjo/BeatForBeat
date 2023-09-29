import Button from "antd/es/button/button";
import Input from "antd/es/input/Input";
import React, { useState } from "react";
import SongSelection from "./SongSelection";
import { Content } from "antd/es/layout/layout";
import { FileTextOutlined } from "@ant-design/icons";
import Spin from "antd/es/spin";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Collapse, FloatButton } from "antd";

interface GameConfigurationProps {
  fire: any;
}

function GameConfiguration(props: GameConfigurationProps) {
  const firestore = props.fire;
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
      formValue[2].split(" ").length < 5 ||
      formValue[2].split(" ").length > 6
    )
      alert("Please write between 5 and 6 words");
    else {
      await messagesRef.add({
        artist: formValue[0],
        name: formValue[1],
        lyrics: formValue[2],
      });
      setFormValue(["", "", ""]);
    }
  };
  return (
    <>
      <h1
        style={{
          color: "black",
          alignItems: "center",
          marginTop: "3rem",
          marginLeft: "3rem",
        }}
      >
        {" "}
        Beat for beat - Setup 🎶
      </h1>
      <Content className="site-layout" style={{ padding: "0 5%" }}>
        <div style={{ paddingTop: "2rem" }}>
          <h2>Steg 1: Velg sanger!</h2>
          {loading && <Spin size="large" />}
          {fetchedSongs && (
            <SongSelection song={fetchedSongs} saveToFirebase={gamesRef} />
          )}
        </div>
        <h3 style={{ marginTop: "3rem" }}>
          Psst! Fant du ikke alle sangene du ønsket i listen over?
        </h3>
        <Collapse
          items={[
            {
              key: 1,
              label: "Frykt ikke! Her kan du legge til flere",
              children: (
                <div>
                  <form onSubmit={addSong}>
                    <label>Artist:</label>
                    <Input
                      type="text"
                      value={formValue[0]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormValue([
                          e.target.value,
                          formValue[1],
                          formValue[2],
                        ])
                      }
                    />
                    <label>Tittel:</label>
                    <Input
                      required
                      type="text"
                      value={formValue[1]}
                      onChange={(e) =>
                        setFormValue([
                          formValue[0],
                          e.target.value,
                          formValue[2],
                        ])
                      }
                    />
                    <label>lyrics (Skriv enten 5 eller 6 ord fra sangen)</label>
                    <Input
                      required
                      type="text"
                      value={formValue[2]}
                      onChange={(e) =>
                        setFormValue([
                          formValue[0],
                          formValue[1],
                          e.target.value,
                        ])
                      }
                    />
                    <Button type="default" htmlType="submit">
                      Legg til sang i database
                    </Button>
                  </form>
                </div>
              ),
            },
          ]}
        />
        <FloatButton
          icon={<FileTextOutlined rev={undefined} />}
          description="Regler"
          shape="square"
          onClick={() => {
            alert(
              "Regler!☀️\n🎶 Beat for beat 🎶Ivar dyrhaug \n \n Du er host/Ivar Dyrhaug! \n\n Del deltagerene inn i to like store lag \n\n  Lagene får poeng ved å: \n 1.Klare å synge en sang som innholder ordet. (Ett poeng) \n 2.Klare å synge den skjulte sangteksten. 🎙️ (Like mange poeng som ruter du avslører) \n \nLagene velger rute annenhver gang Hvis du velger en rute som er rød får man ikke mulighet til å ta poeng og runden går over til det andre teamet. \n\n Velg ca 8 Sanger"
            );
          }}
          style={{ right: 24 }}
        />
      </Content>
    </>
  );
}

export default GameConfiguration;
