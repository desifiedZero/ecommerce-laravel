import React, { useState } from "react";
import './auth.css';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export default function Auth(props) {
    const [name, setName] = useState("No page here");
    const navigate = useNavigate();

    return <div className="container-suspend">
        <div className="form-container">
        <div>
            <Link to="#" onClick={() => navigate(-1)}>
                <ArrowBack />
            </Link>
        </div>
            <h1>{ name }</h1>
            <Outlet context={ { setName } }/>
        </div>
    </div>
}