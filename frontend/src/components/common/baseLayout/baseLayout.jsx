import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import { Link, Outlet } from "react-router-dom";

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import { AppRegistration, Login, Person, Logout } from "@mui/icons-material";
import { NotificationManager } from "react-notifications";

const styles = {
    display: 'flex',
    height: '100%',
    maxHeight: '100vh',
    overflow: 'hidden'
}
const stylesSidebar = {
    background: 'darkGrey', 
    zIndex: '3'
}
const flex = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    placeContent: 'space-between'
}

export default function BaseLayout(props) {
    const { collapseSidebar, collapsed } = useProSidebar();

    const [user, setUser] = useState(null);
    const fetchUserInfo = () => {
        if (localStorage.getItem('auth-token') && localStorage.getItem('username'))
            setUser({
                token: localStorage.getItem('auth-token'),
                name: localStorage.getItem('username')
            });
        else 
            setUser(null);
    }

    useEffect(() => {
        fetchUserInfo();
    }, [])

    const authInfo = () => {
        if (user != null) {
            return <Menu>
                <Link to="/user">
                    <MenuItem icon={<Person />}> {user.name} </MenuItem>
                </Link>
                <MenuItem icon={<Logout />} onClick={() => {
                    localStorage.clear();
                    setUser(null);
                    NotificationManager.info("You logged out successfully");
                }}> Logout </MenuItem>
            </Menu>
        } else {
            return <Menu>
                <Link to="/auth/login">
                    <MenuItem icon={<Login />}> Login </MenuItem>
                </Link>
                <Link to="/auth/signup">
                    <MenuItem icon={<AppRegistration />}> Register </MenuItem>
                </Link>
            </Menu>
        }
    }

    return <div style={ styles }>
            <div style={ stylesSidebar }>
                <Sidebar style={{ height: '100%', backgroundColor: 'blueGrey' }} defaultCollapsed="true" >
                    <div style={flex}>
                        <div>
                            <Menu>
                                <Link to="/">
                                    <MenuItem icon={<RocketLaunchIcon />}>
                                        <b>E-Commerse Solution</b>
                                    </MenuItem>
                                </Link>
                            </Menu>
                            <hr />
                            <Menu>
                                <SubMenu label="Categories" icon={<CategoryIcon />}>
                                </SubMenu>
                            </Menu>
                        </div>
                        <div>
                            {authInfo()}
                        </div>
                    </div>
                </Sidebar>
            </div>
            <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', overflow: 'auto'}} onClick={() => {
                    if (!collapsed) collapseSidebar(!collapsed);
                }}>
                <Button sx={{padding: '1rem 0', justifyContent: 'left', padding: '1rem'}} onClick={() => {
                    if (collapsed) collapseSidebar(!collapsed);
                }}>
                    <MenuIcon sx={{color: 'grey'}}/>
                </Button>

                <Outlet context={ {...props} }/>
            </div>
        </div>;
    
}