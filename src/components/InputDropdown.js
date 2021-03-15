import React from "react";
import { Input, Col, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
// debounce function to prevent constant api calls
import { debounce } from "lodash";

// styling
import "./style/SearchBar.css";
import "./style/InputDropdown.css";

function InputDropdown(props) {
    return (
        <Col>
            <Dropdown
                overlay={
                    props.list.length ? (
                        <Menu
                            onClick={(e) => {
                                props.setQuery(e.key);
                                debounce(
                                    () =>
                                        props.handleChange(
                                            e.key,
                                            props.setList
                                        ),
                                    200
                                )();
                            }}
                        >
                            {props.list.map((name) => (
                                <Menu.Item key={name}>{name}</Menu.Item>
                            ))}
                        </Menu>
                    ) : (
                        <></>
                    )
                }
                trigger="hover"
            >
                <Input
                    className="locationinput"
                    size={"large"}
                    placeholder={props.title}
                    value={props.query}
                    onChange={(e) => {
                        props.setQuery(e.target.value);
                        e.preventDefault();
                        debounce(
                            () =>
                                props.handleChange(
                                    e.target.value,
                                    props.setList
                                ),
                            200
                        )();
                    }}
                />
            </Dropdown>
        </Col>
    );
}

export default InputDropdown;
