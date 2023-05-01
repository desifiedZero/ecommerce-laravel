import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useProSidebar } from "react-pro-sidebar";
import { useOutletContext } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { NotificationManager } from "react-notifications";
import ApiRoutes from "apiRoutes";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function Checkout(props) {
    const { setOpen, updateCart, clearCart } = useOutletContext();
    const [openLocal, setOpenLocal] = useState(false);

    const [loadedCart, setLoadedCart] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const [ccNumber, setCcNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [name, setName] = useState(null);
    const [cvv, setCvv] = useState(null);

    const completePurchase = () => {
        let itemsLocal = JSON.parse(localStorage.getItem('cart'));
        let itemMap = [];
        if (itemsLocal) {
            itemMap = Object.keys(itemsLocal).map((key) => {
                return {
                    product: Number(key),
                    count: itemsLocal[Number(key)].count
                }
            });
        }

        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.orders.place), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            },
            body: JSON.stringify({
                'products': itemMap,
            })
        })
        .then(x => x.json())
        .then((data) => {
            if (data.success) {
                NotificationManager.success("Order placed successfully");
                setOpen(false);
                clearCart();
                setLoaded(false);
            } else {
                NotificationManager.success("There was an issue placing the order");
            }
        });

        setOpenLocal(false);
    }

    useEffect(() => {
        let itemsLocal = JSON.parse(localStorage.getItem('cart'));
        let itemMap = [];
        if (itemsLocal) {
            itemMap = Object.keys(itemsLocal).map((key) => {
                return Number(key)
            });
        }

        if (!loaded) {
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
                let items = data.data.map(x => {
                    x.count = itemsLocal[Number(x.id)].count;
                    return x;
                })
                setLoadedCart(items);
                setLoaded(true);
            })
        }
    }, [loaded])

    useEffect(() => {
        console.log(name, cvv, date, ccNumber)
    })

    const itemer = () => {
        if (!loadedCart || loadedCart.length == 0)
            return "No items added to cart.";

        return loadedCart.map(x => {
            return <ListItem
            secondaryAction={
                <div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
                    <ListItemText primary={"Rs. " + (x.price * x.count).toFixed(2)}/>
                </div>
                }
            >
                <ListItemText primary={x.name} secondary={"Units: " + x.count}/>
          </ListItem>;
        })
    }
    
    return <> 
    <Container>
        <Grid container>
        <Grid item xs={12}>
            <List>
                {itemer()}
            </List>
        </Grid>
        <Grid item xs={12}>
            <Button variant="contained" onClick={() => {setOpenLocal(true)}} disabled={loadedCart.length <= 0}>Pay</Button>
        </Grid>
    </Grid>
    </Container>

    <Dialog
        open={openLocal}
        scroll={'paper'}
        fullWidth={true}
        onClose={() => setOpenLocal(false)}
        aria-labelledby="responsive-dialog-title"
        aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="responsive-dialog-title">
            Payment
        </DialogTitle>
        <DialogContent id="scroll-dialog-description">
            <TextField 
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                fullWidth
                value={ccNumber ?? ""}
                onChange={(e) => {
                    setCcNumber(e.target.value);
                }}
                label={"Credit/Debit Card Number"}
                margin={"normal"}
            />

            <Grid container>
                <Grid item md={12}>
                    <TextField 
                        fullWidth
                        label={"Name on Card"}
                        margin={"normal"}
                        value={name ?? ""}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker  
                            label={"Expiry Month and Year"} 
                            sx={{marginTop: '1rem'}}
                            views={['month', 'year']} 
                            value={date}
                            onChange={(e) => {
                                setDate(e);
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item md={6}>
                    <TextField 
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                        type="number"
                        fullWidth
                        label={"CVV"}
                        margin={"normal"}
                        value={cvv ?? ""}
                        onChange={(e) => {
                            setCvv(e.target.value);
                        }}
                    />
                </Grid>
            </Grid>

        </DialogContent>
        <DialogActions>
            <Button onClick={() => {setOpenLocal(false)}} size="large">
                Cancel
            </Button>
            <Button onClick={completePurchase} size="large" variant="contained" color="success" disabled={!name || !cvv || !date || !ccNumber}>
                Complete purchase
            </Button>
        </DialogActions>
    </Dialog>
    </>;
    
}