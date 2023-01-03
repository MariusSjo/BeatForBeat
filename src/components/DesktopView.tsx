import QRCode from "antd/es/qrcode";
import React, { useState } from "react";

export default function DesktopView(props: any) {
  const id = props.props;
  return (
    <>
      <div className="centercontent">
        {" "}
        <h1>
          Ivar Dyrhaug scanner QR-koden med mobilen og kobler denne skjermen til
          en storskjerm!
        </h1>
        <QRCode
          errorLevel="H"
          value={process.env.REACT_APP_REDIRECTURL! + id}
        />
      </div>
    </>
  );
}
function sleep(arg0: number) {
  throw new Error("Function not implemented.");
}
