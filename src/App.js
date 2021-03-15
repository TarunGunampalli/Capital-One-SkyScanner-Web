import React, { useState } from "react";
import { Table } from "antd";

import "./App.css";
import SearchBar from "./components/SearchBar";

export default function App() {
    const [entries, setEntries] = useState([]);

    return (
        <div className="App">
            <SearchBar setEntries={setEntries}></SearchBar>
            <Table
                className="table"
                dataSource={entries}
                columns={getColumns(entries)}
            ></Table>
        </div>
    );
}

function getColumns(entries) {
    const symbol = entries[0]?.Symbol ? "(" + entries[0]?.Symbol + ")" : "";
    const columns = [
        {
            title: "Carrier",
            dataIndex: "Carrier",
            key: "Carrier",
        },
        {
            title: "Departure Location",
            dataIndex: "Place",
            key: "Place",
        },
        {
            title: `Price ${symbol}`,
            dataIndex: "Price",
            key: "Price",
            sorter: (x, y) => x.Price - y.Price,
            sortDirections: ["descend", "ascend"],
        },
    ];
    return columns;
}
