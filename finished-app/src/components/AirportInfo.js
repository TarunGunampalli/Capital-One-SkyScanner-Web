import React, { useState } from "react";
import "./AirportInfo.css";
import Places from "./Places";
import { Row, Col, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";

import InputDropdown from "./InputDropdown";

const { SubMenu } = Menu;

function AirportInfo() {
    const [places, setPlaces] = useState([]);
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [showPlaces, setShowPlaces] = useState(false);

    return (
        <div className="airportinfo">
            <form>
                <Row span={24}>
                    <InputDropdown
                        title="From"
                        query={fromQuery}
                        setQuery={setFromQuery}
                        setPlaces={setPlaces}
                        setShowPlaces={setShowPlaces}
                        // handleChange={handleChange}
                    />
                    <InputDropdown
                        title="To"
                        query={toQuery}
                        setQuery={setToQuery}
                        setPlaces={setPlaces}
                        setShowPlaces={setShowPlaces}
                        // handleChange={handleChange}
                    />
                    <Col span={4}>
                        <button className="search">Submit</button>
                    </Col>
                </Row>
            </form>
            <Row>{showPlaces ? <Places places={places}></Places> : <></>}</Row>
        </div>
    );
}

export default AirportInfo;
