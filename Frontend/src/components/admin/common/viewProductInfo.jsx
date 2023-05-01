import { KeyboardReturnOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function ViewProductInfo(props) {
    const updated = props.updated;

    const [user, setBanner] = useState({});

    const del = () => {
        const route = ApiRoutes.admin.products.delete + user?.id;

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(() => {
                NotificationManager.success("Product has been successfully deleted");
                updated();
            })
    }

    useEffect(() => {
            setBanner(props.user);
    });
    console.log(process.env)
    return <>
        
    <img src={process.env.REACT_APP_BACKEND_URL + user.image} alt={user.tag} style={{maxWidth: '100%', marginBottom: '1rem'}}/>

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="Name"
        value={user?.name ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="Description"
        multiline
        rows={4}
        value={user?.description ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="Price"
        value={user?.price ?? ""}
        type="number"
        sx={{marginBottom: '1rem'}}
    />

    <Button variant="outlined" color="error" size="large" onClick={del}>Delete</Button>
    </>;
}