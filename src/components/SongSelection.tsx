import React, { useState } from "react";
import { Button, Table, Transfer } from "antd";
import type { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import type { TransferItem, TransferProps } from "antd/es/transfer";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { Select } from "antd";
import type { SelectProps } from "antd";

interface RecordType {
  value: string;
  label: string;
  key: string;
  name: string;
  lyrics: string;
  artist?: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: RecordType[];
  leftColumns: ColumnsType<RecordType>;
  rightColumns: any;
}

// Customize Table Transfer
const TableTransfer = ({
  leftColumns,
  rightColumns,
  ...restProps
}: TableTransferProps) => (
  //@ts-ignore
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      /* onItemSelectAll, */
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      const columns = direction === "left" ? leftColumns : rightColumns;
      const rowSelection: TableRowSelection<TransferItem> = {
        onSelect({ key }, selected) {
          onItemSelect(key as string, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="large"
          onRow={({ key }) => ({
            onClick: () => {
              onItemSelect(
                key as string,
                !listSelectedKeys.includes(key as string)
              );
            },
          })}
        />
      );
    }}
  </Transfer>
);

const rightTableColumns: ColumnsType<Pick<RecordType, "name">> = [
  {
    dataIndex: "name",
  },
];

function changeObject(songs: [RecordType]): any[] {
  const tempArray: RecordType[] = [];
  for (let i = 0; i < songs.length; i++) {
    const newSongFormat: RecordType = {
      value: i + "",
      label: songs[i].artist + " - " + songs[i].name,
      name: songs[i].name,
      artist: songs[i].artist,
      lyrics: songs[i].lyrics,
      key: i + "",
    };
    tempArray.push(newSongFormat);
  }
  return tempArray;
}

function SongSelection(songs: any) {
  const save = songs.saveToFirebase;
  const displaySongs = changeObject(songs.song);

  const [selectedSongs, setSelectedSongs] = useState<string[]>();
  const onChange = (nextSelectedSongs: string[]) => {
    console.log("onChange", nextSelectedSongs);
    setSelectedSongs(nextSelectedSongs);
  };

  function saveSongs(): void {
    const filteredSongs = displaySongs.filter((song: any) =>
      selectedSongs?.includes(song.value)
    );
    if (filteredSongs && filteredSongs.length < 1) {
      alert("Please select at least one song");
      return;
    }
    save.doc(localStorage.getItem("gameID")).update({
      songs: filteredSongs,
    });
    save.doc(localStorage.getItem("gameID")).update({
      gameStarted: true,
    });
  }

  const options: SelectProps["options"] = [];

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        optionFilterProp="children"
        placeholder="Tags Mode"
        onChange={onChange}
        options={displaySongs}
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
      />
      <div style={{ paddingTop: "5%" }}>
        <Button type="primary" onClick={() => saveSongs()}>
          {" "}
          Save song selection and start game
        </Button>
      </div>
    </>
  );
}

export default SongSelection;
