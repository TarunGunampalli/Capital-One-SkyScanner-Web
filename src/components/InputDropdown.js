import React, { useState } from "react";
import "./InputDropdown.css";
import Places from "./Places";
import { Input, Row, Col, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";

const { SubMenu } = Menu;

function handleChange(e, setResponse) {
    e.preventDefault();
    console.log(e);
    async function fetchMyAPI() {
        const reqOptions = {
            method: "GET",
            headers: {
                "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
                "x-rapidapi-host":
                    "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                useQueryString: true,
            },
        };
        let response = await fetch(
            "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
                new URLSearchParams({ query: e.target.value }),
            reqOptions
        );
        response = await response.json();

        let ids = response.Places.map((place) => place.PlaceId);
        let names = response.Places.map((place) => place.PlaceName);
        response = Object.assign(...ids.map((id, i) => ({ [id]: names[i] })));

        setResponse(response);
        console.log(response);
    }
    fetchMyAPI();
}

function InputDropdown(props) {
    const [response, setResponse] = useState({ hi: "world" });

    return (
        <Col span={10}>
            <Row>
                <label className="locationlabel" htmlFor="queryInput">
                    {props.title}
                </label>
            </Row>
            <Row>
                <Dropdown
                    overlay={
                        <Menu>
                            {Object.values(response) ? (
                                Object.values(response).map((placeName) => (
                                    <Menu.Item>{placeName}</Menu.Item>
                                ))
                            ) : (
                                <></>
                            )}
                        </Menu>
                    }
                    trigger="click"
                >
                    <Input
                        className="locationinput"
                        id="queryInput"
                        value={props.query}
                        onChange={(e) => {
                            props.setQuery(e.target.value);
                            handleChange(e, setResponse);
                            console.log(response);
                        }}
                    />
                </Dropdown>
            </Row>
        </Col>
    );
}

export default InputDropdown;
