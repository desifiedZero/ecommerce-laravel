import { KeyboardReturnOutlined } from "@mui/icons-material";
import { Alert, Button, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function DisplayUserInfo(props) {
    const disableChange = props.disableChange;
    const updated = props.updated;
    const newItem = props.newItem;
    const setNewItem = props.setNewItem;
    const type = props.type;

    const [user, setUser] = useState(null);
    const [intialLoad, setIntialLoad] = useState(true);
    const [editingDisabled, setEditingDisabled] = useState(true);

    const handleChange = (val) => {
        setUser(val);
    }

    const cancel = () => {
        if(newItem) {
            setNewItem(false);
        }
        setEditingDisabled(true);
        disableChange(false);
    };

    const update = (user) => {
        const route = newItem ? ApiRoutes.admin.user.registerAdmin : ApiRoutes.admin.user.edit;

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            },
            body: JSON.stringify(user)
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
                setEditingDisabled(true);
                cancel();
            })
            .catch(error => {
                console.log(error);
                
            })
    }

    const del = () => {
        const route = ApiRoutes.admin.user.deleteUser + user?.id;

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'DELETE',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(() => {
                updated();
                setEditingDisabled(true);
                cancel();
            })
    }
    
    const updateReminder = <Alert severity="info" sx={{marginBottom: '1rem'}}>Edit and save your information</Alert>;
    const newReminder = <Alert severity="info" sx={{marginBottom: '1rem'}}>You are adding a new admin. Please save to complete.</Alert>;

    const editPrompt = <>
        <Button variant="contained" color="info" size="large" sx={{marginRight: '1rem'}} onClick={() => {
            setEditingDisabled(false);
            disableChange(true);
        }}>Edit</Button>
        <Button variant="outlined" color="error" size="large" onClick={del}>Delete</Button>
    </>;

    const savePrompt = <>
        <Button variant="contained" color="success" size="large" sx={{marginRight: '1rem'}}  onClick={() => {
            update(user);
        }}>Save</Button>
        <Button size="large" onClick={cancel}>Cancel</Button>
    </>;

    useEffect(() => {
        if(newItem)
            setEditingDisabled(false);

        if (newItem && intialLoad) {
            setEditingDisabled(false);
            setIntialLoad(false);
            setUser({});
            return;
        }

        if (editingDisabled && intialLoad) {
            setUser(JSON.parse(JSON.stringify(props.user)));
            if (props.user != null) {
                setIntialLoad(false);
            }
        }
        else if (editingDisabled) {
            setUser(JSON.parse(JSON.stringify(props.user)));
        }
    });

    const nonAdminStuff = <>
            <TextField
        disabled={editingDisabled}
        fullWidth
        id="outline-disabled"
        label="Phone"
        value={user?.phone ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.phone = e.target.value;
            handleChange(tmp)
        }}        
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        disabled
        fullWidth
        id="outline-disabled"
        label="Created At"
        value={user?.created_at ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.created_at = e.target.value;
            handleChange(tmp)
        }}
        sx={{marginBottom: '1rem'}}
    />

    </>;

    const creatingAdminForm = <>
    <TextField
    disabled={editingDisabled}
    fullWidth
    id="outline-disabled"
    label="Password"
    type="password"
    value={user?.password ?? ""}
    onChange={(e) => {
    let tmp = JSON.parse(JSON.stringify(user))
    tmp.password = e.target.value;
    handleChange(tmp)
    }}        
    sx={{marginBottom: '1rem'}}
    />

    <TextField
    disabled={editingDisabled && newItem}
    fullWidth
    id="outline-disabled"
    label="Confirm Password"
    type="password"
    value={user?.c_password ?? ""}
    onChange={(e) => {
    let tmp = JSON.parse(JSON.stringify(user))
    tmp.c_password = e.target.value;
    handleChange(tmp)
    }}
    sx={{marginBottom: '1rem'}}
    />

    </>;
    
    if (user == null) return;

    return <>
        {editingDisabled ?  null : (newItem ? newReminder : updateReminder)}

    <TextField
        disabled
        fullWidth
        id="outline-disabled"
        label="ID"
        value={user?.id ?? ""}
        sx={{marginBottom: '1rem'}}
    />
    
    <TextField
        disabled={editingDisabled}
        fullWidth
        id="outline-disabled"
        label="Name"
        value={user?.name ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.name = e.target.value;
            handleChange(tmp)
        }}
        sx={{marginBottom: '1rem'}}
    />
    
    <TextField
        disabled={!newItem}
        fullWidth
        id="outline-disabled"
        label="Email"
        value={user?.email ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.email = e.target.value;
            handleChange(tmp)
        }}
        sx={{marginBottom: '1rem'}}
    />

    {String(type).toLowerCase() != 'admin' ? nonAdminStuff : null}
    {String(type).toLowerCase() == 'admin' && newItem ? creatingAdminForm : null}
    
    {editingDisabled ? editPrompt : savePrompt}
    </>;
}