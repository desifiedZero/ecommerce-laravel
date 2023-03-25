import React, { useState } from "react";
import './index.css';
import { Outlet } from "react-router-dom";
import Login from "./login/login";

export default function Auth(props) {
    const [name, setName] = useState("No page here");

    return <div className="container-suspend">
        <div>
            <h1>{name}</h1>
        </div>
        <div className="form-container">
            <Outlet context={ {setName} }/>
        </div>
    </div>
}