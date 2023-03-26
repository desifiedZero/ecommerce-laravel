import { Container, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function User() {
    const [user, setUser] = useState(null);

    const headers = {
        'Authorization': 'Bearer '.concat(localStorage.getItem('auth-token')),
        'Accept': 'application/json'
    };

    const marginBot = {
        marginBottom: "1rem"
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.getUserInfo), {
            headers: headers
        })
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setUser(data);
                console.log(data);
            })
            .catch(err => {
                NotificationManager.error("There was a problem loading the data. Please try again in a while.")
            })
    }, [])

    return <Container maxWidth='fluid'>
        <h1>User Details</h1>

        <TextField
          disabled
          fullWidth
          id="outline-disabled"
          label="Name"
          value={user?.name ?? "-"}
          defaultValue="-"
          style={marginBot}
        />
        
        <TextField
          disabled
          fullWidth
          id="outline-disabled"
          label="Email"
          value={user?.email ?? "-"}
          defaultValue="-"
          style={marginBot}
        />
        
        <TextField
          disabled
          fullWidth
          id="outline-disabled"
          label="Phone"
          value={user?.phone ?? "-"}
          defaultValue="-"
          style={marginBot}
        />
    </Container>
}