// react and ant design packages
import React, { useState } from "react";
import { Row, Col, DatePicker, Dropdown, Menu, Button } from "antd";
import "antd/dist/antd.css";

// styling and inner components
import "./SearchBar.css";
import InputDropdown from "./InputDropdown";

const { RangePicker } = DatePicker;

// function taken from thesofakillers on github that converts an object of arrays to an
// array of objects
function convertData(object_arrays) {
    let final_array = object_arrays[Object.keys(object_arrays)[0]].map(
        (el, i) => {
            let internal_object = {};
            Object.keys(object_arrays).forEach(
                (key) => (internal_object[key] = object_arrays[key][i])
            );
            return internal_object;
        }
    );
    return final_array;
}

function siftInfo(entries) {
    let result = [];
    entries.forEach((entry, i) => {
        if (
            entry.Carriers?.Name &&
            entry.Places?.Name &&
            entry.Quotes?.MinPrice
        ) {
            result[i] = {
                Carrier: entry.Carriers?.Name,
                Place: entry.Places?.Name,
                Price: entry.Quotes?.MinPrice,
                Symbol: entry.Currencies?.Symbol,
            };
        }
    });
    return result;
}

function searchPlaces(e, setPlaces, currency) {
    currency = currency ? currency : "USD";
    async function callPlaces() {
        const endpoint =
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/${currency}/en-US/?` +
            new URLSearchParams({ query: e });
        const reqOptions = {
            method: "GET",
            headers: {
                "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                "x-rapidapi-host":
                    "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                useQueryString: true,
            },
        };

        if (e) {
            let response = await fetch(endpoint, reqOptions);
            if (response.status === 200) {
                response = await response.json();
                let names = response.Places.map((place) => place.PlaceName);
                let ids = response.Places.map((place) => place.PlaceId);
                if (names.length && ids.length) {
                    response = await Object.assign(
                        ...names.map((name, i) => ({ [name]: ids[i] }))
                    );
                    setPlaces(response);
                } else {
                    setPlaces({});
                }
            } else {
                setPlaces({});
            }
        } else {
            setPlaces({});
        }
    }
    callPlaces();
}

function searchCurrencies(e, setCurrencies) {
    async function callPrices() {
        const endpoint =
            "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies";
        const reqOptions = {
            method: "GET",
            headers: {
                "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                "x-rapidapi-host":
                    "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                useQueryString: true,
            },
        };

        if (e) {
            let response = await fetch(endpoint, reqOptions);
            if (response.status === 200) {
                response = await response.json();
                setCurrencies(response.Currencies);
            }
        }
    }
    callPrices();
}

function findFlights(from, to, startDate, endDate, currency, setEntries) {
    currency = currency ? currency : "USD";
    async function callQuotes() {
        const inbound = endDate
            ? "?" + new URLSearchParams({ inboundpartialdate: endDate })
            : "";
        const endpoint =
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${from}/${to}/${startDate}` +
            inbound;
        const reqOptions = {
            method: "GET",
            headers: {
                "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                "x-rapidapi-host":
                    "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
            },
        };
        let response = await fetch(endpoint, reqOptions);
        if (response.status === 200) {
            response = await response.json();
            console.log(response);
            console.log(convertData(response));
            console.log(siftInfo(convertData(response)));
            setEntries(siftInfo(convertData(response)));
        }
    }

    if (from && to) {
        startDate = startDate || "anytime";
        callQuotes();
    }
}

function SearchBar(props) {
    const [fromPlaces, setFromPlaces] = useState([]);
    const [toPlaces, setToPlaces] = useState([]);
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currency, setCurrency] = useState("");
    const [currencies, setCurrencies] = useState([]);

    return (
        <Row className="searchbar" align="middle" justify="space-around">
            <Col span={4}>
                <InputDropdown
                    title="From"
                    query={fromQuery}
                    setQuery={setFromQuery}
                    list={Object.keys(fromPlaces)}
                    setList={setFromPlaces}
                    handleChange={(e, setList) =>
                        searchPlaces(e, setList, currency)
                    }
                />
            </Col>
            <Col span={4}>
                <InputDropdown
                    title="To"
                    query={toQuery}
                    setQuery={setToQuery}
                    list={Object.keys(toPlaces)}
                    setList={setToPlaces}
                    handleChange={(e, setList) =>
                        searchPlaces(e, setList, currency)
                    }
                />
            </Col>
            <Col span={6}>
                <RangePicker
                    className="datepicker"
                    size={"large"}
                    placeholder={["Departure Date", "Return Date"]}
                    allowEmpty={[false, true]}
                    onCalendarChange={(moments, dates) => {
                        setStartDate(dates[0]);
                        setEndDate(dates[1]);
                    }}
                />
            </Col>
            <Col span={4}>
                <Dropdown
                    overlay={
                        currencies.length ? (
                            <Menu onClick={(e) => setCurrency(e.key)}>
                                {currencies.map((currentCurrency) => (
                                    <Menu.Item key={currentCurrency.Code}>
                                        {currentCurrency.Code}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        ) : (
                            <></>
                        )
                    }
                    overlayClassName="currencyselector"
                    trigger={["click"]}
                >
                    <Button
                        className="currencybutton"
                        size={"large"}
                        onClick={(e) => {
                            searchCurrencies(e, setCurrencies);
                        }}
                    >
                        {currency ? currency : "Select Currency"}
                    </Button>
                </Dropdown>
            </Col>
            <Col span={2} className="submitcontainer">
                <Button
                    className="submitbutton"
                    size={"large"}
                    onClick={() => {
                        findFlights(
                            fromPlaces[fromQuery],
                            toPlaces[toQuery],
                            startDate,
                            endDate,
                            currency,
                            props.setEntries
                        );
                    }}
                >
                    Submit
                </Button>
            </Col>
        </Row>
    );
}

export default SearchBar;
