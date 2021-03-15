import React, { useState } from "react";
import { Table } from "antd";

import "./App.css";
import SearchBar from "./components/SearchBar";

export default function App() {
    // entries variable stores the data for the table of flights
    const [entries, setEntries] = useState([]);
    const lowestPrice = getLowestPrice(entries);

    var symbol = entries[0]?.Symbol ? entries[0]?.Symbol : "";

    function setSymbol(newSymbol) {
        symbol = newSymbol;
    }

    return (
        <div className="App">
            {/* SearchBar for input fields */}
            <SearchBar setEntries={setEntries}></SearchBar>
            {isFinite(lowestPrice) ? (
                <div className="lowestprice">
                    Lowest Price!!! {symbol + lowestPrice}
                </div>
            ) : (
                <></>
            )}
            {/* Table to display data of flights and prices */}
            <Table
                className="table"
                dataSource={entries}
                columns={getColumns(entries, symbol)}
            ></Table>
        </div>
    );
}

/**
 *
 * @param entries is used to get the currency symbol
 * @returns the array of columns needed for the table
 */
function getColumns(entries, symbol) {
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
            title: `Price (${symbol})`,
            dataIndex: "Price",
            key: "Price",
            defaultSortOrder: "ascend",
            sorter: (x, y) => x.Price - y.Price,
            sortDirections: ["descend", "ascend"],
        },
    ];
    return columns;
}

/**
 *
 * @param entries the entries of the table to find the prices from
 * @returns the lowest price found
 */
function getLowestPrice(entries) {
    let prices = [];
    entries.forEach((entry, i) => (prices[i] = parseInt(entry.Price)));
    return Math.min(...prices);
}
