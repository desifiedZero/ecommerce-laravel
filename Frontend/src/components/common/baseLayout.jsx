import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import { AppRegistration, Login, Person, Logout, ShoppingBag, WhatsApp } from "@mui/icons-material";
import { NotificationManager } from "react-notifications";
import ApiRoutes from "apiRoutes";
import DeleteIcon from '@mui/icons-material/Delete';

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

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState({});
    const [loadedCart, setLoadedCart] = useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const updateCart = (incomingItem, remove = false) => {
        let sheesh = {};
        if (Object.keys(items).length == 0) {
            sheesh = JSON.parse(localStorage.getItem('cart'));
        } 
        else {
            sheesh = items;
        }

        if (!sheesh[Number(incomingItem)] && !remove) {
            sheesh[Number(incomingItem)] = {
                count: 1
            }
        } else {
            if (remove)
            {
                sheesh[Number(incomingItem)] = undefined;
                setLoadedCart(loadedCart.filter(x => x.id != Number(incomingItem)))
            }
            else
                sheesh[Number(incomingItem)].count++;
        }

        setItems(sheesh);

        localStorage.setItem('cart', JSON.stringify(sheesh))
    }

    const clearCart = () => {
        localStorage.setItem('cart', '{}');

        setItems([]);
        setOpen(false);

        NotificationManager.info("Cart has been cleared.");
    }

    const completePurchase = () => {
        navigate('/checkout');
        setOpen(false);

        // let items = JSON.parse(localStorage.getItem('cart'));
        // let itemMap = [];
        // if (items) {
        //     itemMap = Object.keys(items).map((key) => {
        //         return {
        //             product: Number(key),
        //             count: items[Number(key)].count
        //         }
        //     });
        // }

        // fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.orders.place), {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: "Bearer " + localStorage.getItem('auth-token')
        //     },
        //     body: JSON.stringify({
        //         'products': itemMap
        //     })
        // })
        //     .then(x => x.json())
        //     .then((data) => {
        //         if (data.success) {
        //             NotificationManager.success("Order placed successfully");
        //             clearCart();
        //             setOpen(false);
        //         } else {
        //             NotificationManager.success("There was an issue placing the order");
        //         }
        //     })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

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

        let items = JSON.parse(localStorage.getItem('cart'));
        let itemMap = [];
        if (items) {
            itemMap = Object.keys(items).map((key) => {
                return Number(key)
            });
        }

        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.getCartItems), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                'products': itemMap
            })
        })
            .then(x => x.json())
            .then((data) => {
                let items2 = data.data.map(x => {
                    x.count = items[Number(x.id)].count;
                    return x;
                })
                setLoadedCart(items2);
            })
    }, [items, open])

    const itemer = () => {
        if (loadedCart.length == 0)
            return "No items added to cart.";

        return loadedCart.map(x => {
            return <ListItem
            secondaryAction={
                <div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
                    <ListItemText primary={"Rs. " + (x.price * x.count).toFixed(2)}/>
                <div style={{marginLeft: "5px"}} onClick={() => {
                    updateCart(x.id, true)
                }}><IconButton>
                      <DeleteIcon />
                </IconButton></div>
                </div>
                }
            >
                <ListItemText primary={x.name} secondary={"Units: " + x.count}/>
          </ListItem>;
        })
    }

    const authInfo = () => {
        if (user != null) {
            return <Menu>
                <MenuItem icon={<ShoppingBag />} onClick={handleClickOpen}> Cart </MenuItem>
                <Link to="/user">
                    <MenuItem icon={<Person />}> {user.name} </MenuItem>
                </Link>
                <MenuItem icon={<Logout />} onClick={() => {
                    localStorage.clear();
                    localStorage.setItem('cart', '{}');
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
                                {/* <SubMenu label="Categories" icon={<CategoryIcon />}>
                                </SubMenu> */}
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

                <Outlet context={ {...props, setOpen, updateCart, clearCart} }/>
            </div>
            <Dialog
                open={open}
                scroll={'paper'}
                fullWidth={true}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="responsive-dialog-title">
                <b>Cart</b>
                </DialogTitle>
                <DialogContent id="scroll-dialog-description">
                    <List>
                        {itemer()}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clearCart} size="large">
                        Clear Cart
                    </Button>
                    <Button onClick={completePurchase} autoFocus size="large" variant="contained" color="success">
                        Complete purchase
                    </Button>
                </DialogActions>
            </Dialog>
            <IconButton 
            color="success" 
            aria-label="" 
            sx={{ position: 'fixed', bottom: '1rem', right: '1rem', ':hover': {
                background: 'white',
                outline: '3px #128C7E solid',
                outlineOffset: '-3px',
                '&> svg': {
                    color: '#128C7E'
                },
                transition: 'all .15s'
            }, background: '#128C7E'}} 
            size="large"
            onClick={() => {
                window.open("https://api.whatsapp.com/send?phone=+1631-555-1111&text=I%20need%20help%20placing%20my%20order", "_blank")
            }}>
                <WhatsApp sx={{zoom: '1.2', ':hover': {
            }, color: 'white'}}/>
            </IconButton>
        </div>;
    
}