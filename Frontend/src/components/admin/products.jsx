import { Button, Grid, List, ListItemButton, ListItemText } from "@mui/material";

import { Container } from "@mui/system";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import CreateBannerInfo from "./common/createBannerInfo";
import ViewBannerInfo from "./common/viewBannerInfo";
import CreateProductInfo from "./common/createProductInfo";
import ViewProductInfo from "./common/viewProductInfo";

export default function AdminProducts(props) {
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedBannerMemory, setSelectedBannerMemory] = useState(null);

    const [usersFetched, setBannersFetched] = useState(false);

    const [newItem, setNewItem] = useState(false);
    const [viewItem, setViewItem] = useState(false);
    
    const [disabled, setDis] = useState(false);
    const [buttons, setButtons] = useState(<></>);

    const disableChange = (val) => {
        setDis(val);
        setSelectedBanner(selectedBannerMemory);
    }
    
    const handleListItemClick = (_, index) => {
      setSelectedBanner(banners.find(x => x.id === index));
    };

    const fetchBanners = () => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.admin.products.getAll), {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setBanners(data.data);
                setBannersFetched(true);
            })
            .catch(err => {
                console.log(err);
            })
    };

    useEffect(() => {
        if (!usersFetched) {
            fetchBanners();
        }
    })

    useEffect(() => {
        setButtons(banners.map(x => 
            <ListItemButton
            selected={selectedBanner?.id == x?.id}
            onClick={(event) => {
                handleListItemClick(event, x?.id)
                setNewItem(false);
                setViewItem(true);
                }}
            disabled={disabled || newItem}
            >
                <ListItemText primary={x?.name} secondary={"ID: " + x?.id} />
            </ListItemButton>));
    }, [banners, selectedBanner, disabled]);

    const noUser = <ListItemButton>
        <ListItemText primary={"No products available"} />
    </ListItemButton>;

    const onUpdated = () => {
        setDis(false);
        setBannersFetched(false);
    }

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Container>
                <h1>Products</h1>
                <Grid container sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <Grid item xs={12} sm={4} style={{maxHeight: '80vh', border: '1px #eee solid', marginBottom: '1rem'}}>
                        <List component="nav" aria-label="secondary mailbox folder"  sx={{padding: 0, maxHeight: '100%', overflow: 'hidden', overflow: 'auto'}}>
                            {banners.length > 0 ? buttons : noUser}
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={8} style={{paddingLeft: '1rem'}}>
                        <Grid container sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <Grid item sm={12} style={{marginBottom: '1rem'}}>
                                <Button variant="contained" color="success" size="large" onClick={() => {
                                    setSelectedBannerMemory(selectedBanner);
                                    setSelectedBanner({});
                                    setNewItem(true);
                                    setViewItem(false);
                                }} disabled={disabled || newItem}>New Product</Button>
                            </Grid>
                            <Grid item sm={12}>
                                {newItem && <CreateProductInfo user={selectedBanner} newItem={newItem} setNewItem={setNewItem} disableChange={disableChange} updated={onUpdated} type={"admin"}/>}
                                {viewItem && <ViewProductInfo user={selectedBanner} updated={onUpdated}/>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>;
}