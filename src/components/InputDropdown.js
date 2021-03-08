import React from "react";
import { Input, Col, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
// debounce function to prevent constant api calls
import { debounce } from "lodash";

// styling
import "./AirportInfo.css";
import "./InputDropdown.css";

function handleChange(e, setPlaces) {
    async function callPlaces() {
        const endpoint =
            "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
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

function InputDropdown(props) {
    return (
        <Col>
            <Dropdown
                overlay={
                    Object.keys(props.places).length ? (
                        <Menu
                            onClick={(e) => {
                                props.setQuery(e.key);
                                debounce(
                                    () => handleChange(e.key, props.setPlaces),
                                    200
                                )();
                            }}
                        >
                            {Object.keys(props.places).map((placeName) => (
                                <Menu.Item key={placeName}>
                                    {placeName}
                                </Menu.Item>
                            ))}
                        </Menu>
                    ) : (
                        <></>
                    )
                }
                trigger="hover"
            >
                <Input
                    id="queryInput"
                    placeholder={props.title}
                    value={props.query}
                    onChange={(e) => {
                        props.setQuery(e.target.value);
                        e.preventDefault();
                        debounce(
                            () => handleChange(e.target.value, props.setPlaces),
                            200
                        )();
                    }}
                />
            </Dropdown>
        </Col>
    );
}

export default InputDropdown;
