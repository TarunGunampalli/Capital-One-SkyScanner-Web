// react and ant design packages
import React, { useState } from "react";
import { Row, Col, DatePicker, Button } from "antd";
import "antd/dist/antd.css";

// styling and inner components
import "./AirportInfo.css";
import InputDropdown from "./InputDropdown";

const { RangePicker } = DatePicker;

function findFlights(from, to, startDate, endDate) {
    async function callQuotes() {
        const endpoint =
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${from}/${to}/${startDate}?` +
            new URLSearchParams({ inboundpartialdate: endDate });
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
        }
    }

    if (from && to && (startDate || endDate)) {
        callQuotes();
    }
}

function AirportInfo() {
    const [fromPlaces, setFromPlaces] = useState([]);
    const [toPlaces, setToPlaces] = useState([]);
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className="airportinfo">
            <Row align="middle" justify="space-around">
                <Col span={6}>
                    <InputDropdown
                        title="From"
                        query={fromQuery}
                        setQuery={setFromQuery}
                        places={fromPlaces}
                        setPlaces={setFromPlaces}
                    />
                </Col>
                <Col span={6}>
                    <InputDropdown
                        title="To"
                        query={toQuery}
                        setQuery={setToQuery}
                        places={toPlaces}
                        setPlaces={setToPlaces}
                    />
                </Col>
                <Col span={8}>
                    <RangePicker
                        className="datepicker"
                        size={"large"}
                        allowEmpty={[false, true]}
                        onCalendarChange={(moments, dates) => {
                            setStartDate(dates[0]);
                            setEndDate(dates[1]);
                        }}
                    />
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
                                endDate
                            );
                        }}
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default AirportInfo;
