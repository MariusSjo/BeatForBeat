import React, { useState } from "react";
import { Button, Table, Tag, Transfer } from "antd";
import type { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import type { TransferItem, TransferProps } from "antd/es/transfer";
import "firebase/compat/firestore";
import "firebase/compat/auth";

interface RecordType {
  key: string;
  name: string;
  lyrics: string;
  artist: string;
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

const leftTableColumns: ColumnsType<RecordType> = [
  {
    dataIndex: "name",
    title: "Song title",
  },
  {
    dataIndex: "artist",
    title: "Artist",
    render: (Artist) => <Tag>{Artist}</Tag>,
  },
  {
    dataIndex: "lyrics",
    title: "Lyrics",
  },
];

const rightTableColumns: ColumnsType<Pick<RecordType, "name">> = [
  {
    dataIndex: "name",
    title: "Song title",
  },
];

function changeObject(songs: [RecordType]): RecordType[] {
  const tempArray: RecordType[] = [];
  for (let i = 0; i < songs.length; i++) {
    const newSongFormat: RecordType = {
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
    setSelectedSongs(nextSelectedSongs);
  };

  function saveSongs(): void {
    const filteredSongs = displaySongs.filter((song: any) =>
      selectedSongs?.includes(song.key)
    );
    if (filteredSongs.length < 1) {
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

  return (
    <>
      {
        <TableTransfer
          titles={["Available songs to pick", "Selected Songs"]}
          dataSource={displaySongs}
          targetKeys={selectedSongs}
          disabled={false}
          onChange={onChange}
          filterOption={(inputValue, item) =>
            item.name!.indexOf(inputValue) !== -1 ||
            item.artist.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
      }
      <Button onClick={() => saveSongs()}>
        {" "}
        Save song selection and start game
      </Button>
    </>
  );
}

export default SongSelection;
