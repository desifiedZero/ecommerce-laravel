import React, { useState } from "react";
import './index.css';
import { Outlet } from "react-router-dom";

export default function Auth(props) {
    const [name, setName] = useState("Authorize");

    return <div className="container-suspend">
        <div>
            <h1>{name}</h1>
        </div>
        <div className="form-container">
            <Outlet context={ {setName} }/>
        </div>
    </div>
}