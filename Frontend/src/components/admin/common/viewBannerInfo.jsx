import { KeyboardReturnOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function ViewBannerInfo(props) {
    const updated = props.updated;

    const [user, setBanner] = useState({});
    const [loaded, setLoaded] = useState(false);

    const del = () => {
        const route = ApiRoutes.admin.banners.delete + user?.id;

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(() => {
                updated();
            })
    }

    const update = () => {
        const route = ApiRoutes.admin.banners.updateBannerActivity;
        let localUser = JSON.parse(JSON.stringify(user));
        localUser.is_enabled = !localUser.is_enabled;

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            },
            body: JSON.stringify(localUser)
        })
            .then(data => {
                return data.json();
            })
            .then(data => {
                if (data.success)
                    NotificationManager.success(data.message);
                else {
                    NotificationManager.error(data.message);
                    return;
                }
                updated();
            })
    }

    useEffect(() => {
            setBanner(props.user);
            if (user != null)
                setLoaded(true);
    });
    console.log(process.env)
    return <>
        
    <img src={process.env.REACT_APP_BACKEND_URL + user.image} alt={user.tag} style={{maxWidth: '100%'}}/>
    {(!user.is_enabled && <Button variant="contained" color="info" size="large" sx={{marginRight: '1rem'}} onClick={update}>Enable</Button>)}
    {(user.is_enabled && <Button variant="contained" color="info" size="large" sx={{marginRight: '1rem'}} onClick={update}>Disable</Button>)}
    <Button variant="outlined" color="error" size="large" onClick={del}>Delete</Button>
    </>;
}