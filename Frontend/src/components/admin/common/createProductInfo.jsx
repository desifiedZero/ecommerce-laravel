import { KeyboardReturnOutlined } from "@mui/icons-material";
import { Alert, Button, Grid, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function CreateProductInfo(props) {
    const disableChange = props.disableChange;
    const updated = props.updated;
    const newItem = props.newItem;
    const setNewItem = props.setNewItem;

    const [user, setUser] = useState({});
    const [selectedFiles, setSelectedFile] = useState([]);

    const handleChange = (val) => {
        setUser(val);
    }

    const cancel = () => {
        if(newItem) {
            setNewItem(false);
        }
        disableChange(false);
    };

    const handleSeletedFile = (e) => {
        setSelectedFile(e.target.files);
    }

    const update = (user) => {
        const route = ApiRoutes.admin.products.create;

        let formdata = new FormData();
        formdata.append('image', selectedFiles[0])
        formdata.append('name', user?.name)
        formdata.append('description', user?.tag)
        formdata.append('price', user?.price)

        fetch(process.env.REACT_APP_BASE_URL.concat(route), {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            },
            body: formdata
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
                cancel();
            })
    }

    useEffect(() => {
        if (newItem) {
            console.log(selectedFiles);
            return;
        }
    });
    
    return <>
        <Grid container>
            <Grid item>
                <Button
                    variant="contained"
                    component="label"
                    sx={{marginBottom: '1rem'}}
                    >
                    Upload Image
                    <input
                        type="file"
                        hidden
                        onChange={handleSeletedFile}
                    />
                </Button>
            </Grid>
            <Grid item sx={{paddingLeft: '0.6rem', paddingTop: '0.4rem'}}>
                {selectedFiles.length > 0 ? selectedFiles[0].name : null}
            </Grid>
        </Grid>
    
    <TextField
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
        fullWidth
        id="outline-disabled"
        label="Description"
        multiline
        rows={4}
        value={user?.tag ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.tag = e.target.value;
            handleChange(tmp)
        }}
        sx={{marginBottom: '1rem'}}
    />

    <TextField
        fullWidth
        id="outline-disabled"
        label="Price"
        value={user?.price ?? ""}
        onChange={(e) => {
            let tmp = JSON.parse(JSON.stringify(user))
            tmp.price = e.target.value;
            handleChange(tmp)
        }}
        type="number"
        sx={{marginBottom: '1rem'}}
    />

    <Button variant="contained" color="success" size="large" sx={{marginRight: '1rem'}} disabled={selectedFiles <= 0 || !user.name || !user.price} onClick={() => {
        update(user);
    }}>Save</Button>
    <Button size="large" onClick={cancel}>Cancel</Button>
    
    </>;
}