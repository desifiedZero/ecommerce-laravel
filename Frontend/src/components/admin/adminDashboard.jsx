import { Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, {  } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard(props) {

    // useEffect(() => {
    //     fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.allProducts))
    //         .then(x => {
    //             if (x.ok) return x.json();
    //             throw new Error();
    //         })
    //         .then(data => {
    //             setProducts(data.data.map((item) => {
    //                 return <Grid item sm={4} md={3} className="product-item">
    //                     <Link to={"/product/".concat(item.id)}>
    //                         <div className="image-container">
    //                             <img src="https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png" alt="" />
    //                         </div>
    //                         <h3 className="item-name" style={{margin: ".4rem 0"}}>{item.name}</h3>
    //                         <span style={{color: "#2a5"}}></span>
    //                         <p style={{margin: 0}}>{item.description}</p>
    //                     </Link>
    //                 </Grid>
    //             }));
    //         })
    //         .catch(err => {
    //             NotificationManager.error("There was a problem loading the data. Please try again in a while.")
    //         })
    // }, [products]);

    // useEffect(() => {
    //     fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.banners))
    //         .then(x => {
    //             if (x.ok) return x.json();
    //             throw new Error();
    //         })
    //         .then(data => {
    //             setBanners(data.data);
    //         })
    //         .catch(err => {
    //         })
    // }, [banners]);

    const navigator = useNavigate();
    const featureList = ['Users', 'Admins', 'Banners', 'Orders', 'Products'];

    const buttons = featureList.map(x => 
        <Grid xs display="flex" justifyContent="center" alignItems="center">
            <Button size="large" variant="outlined" sx={{width: '100%'}} onClick={() => {
                navigator('' + x.toLowerCase())
            }}>{x}</Button>
        </Grid>);

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                <Container>
                    <h1>Admin Dashboard</h1>
                    <Grid container spacing={1} columnGap={1}>
                        {buttons}
                    </Grid>
                </Container>
            </div>
}