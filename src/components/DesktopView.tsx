import { Typography } from "antd";
import QRCode from "antd/es/qrcode";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";

export default function DesktopView(props: any) {
  const id = props.props;
  return (
    <>
      <div className="centercontent">
        <img
          src="https://media3.giphy.com/media/z4EQtHwoGu4fu/giphy.gif?cid=790b76118296c6ce43df641be26a410b94ac7f4f91dce16d&rid=giphy.gif&ct=g"
          alt="ivar dyrhaug"
        ></img>
        <Title>Beat for beat</Title>
        <Typography>
          Ivar Dyrhaug scanner QR-koden med mobilen og kobler denne skjermen til
          en storskjerm!
        </Typography>
        <QRCode
          errorLevel="H"
          value={process.env.REACT_APP_REDIRECTURL! + id}
        />
      </div>
    </>
  );
}
