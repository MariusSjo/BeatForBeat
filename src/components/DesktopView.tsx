import { Typography } from "antd";
import QRCode from "antd/es/qrcode";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
  width: "100%",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
const carousel: React.CSSProperties = {
  paddingTop: "5rem",
};

const carouselText: React.CSSProperties = {
  textAlign: "left",
};

export default function DesktopView(props: any) {
  const id = props.props;
  return (
    <>
      <div className="centercontent">
        <Carousel autoplay autoplaySpeed={10000} style={carousel}>
          <div>
            <Title>🎶 Beat for beat 🎶</Title>
            <img
              src="https://media3.giphy.com/media/z4EQtHwoGu4fu/giphy.gif?cid=790b76118296c6ce43df641be26a410b94ac7f4f91dce16d&rid=giphy.gif&ct=g"
              alt="Ivar dyrhaug"
              style={contentStyle}
            ></img>
          </div>
          <div>
            <Title level={2}>Regler:</Title>
            <div style={carouselText}>
              <p>
                <b>Du får poeng ved å:</b>
              </p>
              <ol>
                <li>
                  Klare å synge en sang som innholder ordet. <br></br>(Ett
                  poeng)
                </li>
                <li>
                  Klare å synge den skjulte sangteksten. <br></br> (Poeng er
                  antall skjulte ruter)
                </li>
              </ol>
              <p>
                <b>Spillets gang:</b>
              </p>
              <p>Det er annenhver gang å velge rute.</p>
              <p>
                <i>
                  Hvis du velger en rute som er rød får man ikke mulighet til å
                  ta poeng og runden går over til det andre teamet.
                </i>
              </p>
              <p>
                <b>
                  Hosten bestemmer resten. (Om man skal ha med minuspoeng etc.)
                </b>
              </p>
            </div>
          </div>
        </Carousel>

        <Title level={3}>
          Hosten scanner QR-koden📱
          {/* Skriv noe om at "alle skal kunne se skjermen" */}
        </Title>
        <QRCode
          errorLevel="H"
          className="qr"
          value={process.env.REACT_APP_REDIRECTURL! + id}
        />
      </div>
    </>
  );
}
