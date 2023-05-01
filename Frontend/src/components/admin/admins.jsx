import { Button, Grid, List, ListItemButton, ListItemText } from "@mui/material";

import { Container } from "@mui/system";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import DisplayUserInfo from "./common/displayUserInfo";
import { NotificationManager } from "react-notifications";

export default function AdminAdmin(props) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserMemory, setSelectedUserMemory] = useState(null);

    const [usersFetched, setUsersFetched] = useState(false);

    const [newItem, setNewItem] = useState(false);
    
    const [disabled, setDis] = useState(false);
    const [buttons, setButtons] = useState(<></>);

    const disableChange = (val) => {
        setDis(val);
        setSelectedUser(selectedUserMemory);
    }
    
    const handleListItemClick = (_, index) => {
      setSelectedUser(users.find(x => x.id === index));
    };

    const fetchUsers = () => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.admin.user.getAllAdmins), {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setUsers(data.data);
                setUsersFetched(true);
            })
            .catch(err => {
                console.log(err);
            })
    };

    useEffect(() => {
        if (!usersFetched) {
            fetchUsers();
        }
    })

    useEffect(() => {
        setButtons(users.map(x => 
            <ListItemButton
            selected={selectedUser?.id == x?.id}
            onClick={(event) => {
                handleListItemClick(event, x?.id)
                setNewItem(false);
                }}
            disabled={disabled || newItem}
            >
                <ListItemText primary={x?.name} secondary={"ID: " + x?.id} />
            </ListItemButton>));
    }, [users, selectedUser, disabled]);

    const noUser = <ListItemButton>
        <ListItemText primary={"No users available"} />
    </ListItemButton>;

    const onUpdated = () => {
        setDis(false);
        setUsersFetched(false);
    }

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Container>
                <h1>Admins</h1>
                <Grid container sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Grid item xs={12} sm={4} style={{maxHeight: '80vh', border: '1px #eee solid', marginBottom: '1rem'}}>
                        <List component="nav" aria-label="secondary mailbox folder"  sx={{padding: 0, maxHeight: '100%', overflow: 'hidden', overflow: 'auto'}}>
                            {users.length > 0 ? buttons : noUser}
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={8} style={{paddingLeft: '1rem'}}>
                        <Grid container sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <Grid item sm={12} style={{marginBottom: '1rem'}}>
                                <Button variant="contained" color="success" size="large" onClick={() => {
                                    setSelectedUserMemory(selectedUser);
                                    setSelectedUser({});
                                    setNewItem(true);
                                }} disabled={disabled || newItem}>New Admin</Button>
                            </Grid>
                            <Grid item sm={12}>
                                <DisplayUserInfo user={selectedUser} newItem={newItem} setNewItem={setNewItem} disableChange={disableChange} updated={onUpdated} type={"admin"}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>;
}