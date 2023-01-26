import React from "react";
import './index.css';
import { Outlet } from "react-router-dom";

export default function Auth() {
    return <div className="container-suspend">
        <div className="form-container">
            <Outlet />
        </div>
    </div>
}