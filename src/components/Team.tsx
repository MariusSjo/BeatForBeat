import React from "react";

type Props = { name: string };

function Team({ name }: Props) {
  return (
    <div className={name}>
      <input readOnly className="points" type="text" />
    </div>
  );
}

export default Team;
