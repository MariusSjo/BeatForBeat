import React, { useState } from "react";
import { Switch, Table, Tag, Transfer } from "antd";
import type { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import type { TransferItem, TransferProps } from "antd/es/transfer";
import type { song } from "../App";
import difference from "lodash/difference";

interface RecordType {
  key: string;
  name: string;
  lyrics: string;
  artist: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: RecordType[];
  leftColumns: ColumnsType<song>;
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
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
    }) => {
      const columns = direction === "left" ? leftColumns : rightColumns;
      const rowSelection: TableRowSelection<TransferItem> = {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys as string[], selected);
        },
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

const leftTableColumns: ColumnsType<song> = [
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

const rightTableColumns: ColumnsType<Pick<song, "name">> = [
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
  const displaySongs = changeObject(songs.song);
  console.log(displaySongs);

  const [selectedSongs, setSelectedSongs] = useState<string[]>();
  const onChange = (nextSelectedSongs: string[]) => {
    setSelectedSongs(nextSelectedSongs);
  };
  localStorage.setItem(
    "displaySongs",
    JSON.stringify(
      displaySongs.filter((song: any) => selectedSongs?.includes(song.key))
    )
  );
  return (
    <>
      {
        <TableTransfer
          titles={["Available songs to pick", "Selected Songs"]}
          dataSource={displaySongs}
          targetKeys={selectedSongs}
          disabled={false}
          showSearch={true}
          onChange={onChange}
          filterOption={(inputValue, item) =>
            item.title!.indexOf(inputValue) !== -1 ||
            item.artist.indexOf(inputValue) !== -1
          }
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
        />
      }
    </>
  );
}

export default SongSelection;
