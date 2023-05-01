import { KeyboardReturnOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function ViewOrderInfo(props) {
    const [data, setData] = useState({});
    let total = 0;
    
    useEffect(() => {
        setData(props.user);
    });

    const noUser = <ListItemButton>
        <ListItemText primary={"No orders available"} />
    </ListItemButton>;

    let items = data?.products?.map(x => {
        return <ListItem
            secondaryAction={
                <div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
                    <ListItemText primary={"Rs. " + (x.price * x.count).toFixed(2)}/>
                </div>
                }
            >
                <ListItemText primary={x.name} secondary={"Units: " + x.count}/>
        </ListItem>});

    data?.products?.map(x => total += x.price * x.count);

    return <>
        
    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="ID"
        value={data?.id ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <h3>User Info</h3>

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="User ID"
        value={data?.user?.id ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="User Name"
        value={data?.user?.name ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        fullWidth
        disabled
        id="outline-disabled"
        label="User Email"
        value={data?.user?.email ?? ""}
        sx={{marginBottom: '1rem'}}
    />

    <h3>Products</h3>
    <List component="nav" aria-label="secondary mailbox folder"  sx={{padding: 0, maxHeight: '100%', overflow: 'hidden', overflow: 'auto'}}>
        {data.products?.length > 0 ? items : noUser}
    </List>

    <Grid container style={{padding: '0 1rem'}}>
        <Grid item xs={6}>
            <h3>Total</h3>
        </Grid>
        <Grid item xs={6}>
            <h3 style={{textAlign: 'right'}}>Rs. {total.toFixed(2)}</h3>
        </Grid>
    </Grid>
    </>;
}