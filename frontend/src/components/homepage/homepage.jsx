import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Link } from "react-router-dom";

import './home.css'

export default function Homepage(props) {
    const [products, setProducts] = useState(<></>);

    useEffect(() => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.allProducts))
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setProducts(data.data.map((item) => {
                    return <Grid item sm={4} md={3} className="product-item">
                        <Link to={"/product/".concat(item.id)}>
                            <div className="image-container">
                                <img src="https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png" alt="" />
                            </div>
                            <h3 className="item-name" style={{margin: ".4rem 0"}}>{item.name}</h3>
                            <span style={{color: "#2a5"}}></span>
                            <p style={{margin: 0}}>{item.description}</p>
                        </Link>
                    </Grid>
                }));
            })
            .catch(err => {
                NotificationManager.error("There was a problem loading the data. Please try again in a while.")
            })
    }, []);

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                <div id="banner" style={{height: '33vh', maxHeight: '33vh', width: '100%', background: 'black', overflow: 'hidden'}}>
                    <img style={{width: '100%', height: '100%', objectFit: 'cover'}} src="http://cdn.shopify.com/s/files/1/0373/5968/1672/collections/SALE_1200x1200.jpg?v=1667251665" alt="" />
                </div>

                <Container maxWidth="fluid">
                    <h1>Our Products</h1>
                    <Grid container spacing={2}>
                        {products}
                    </Grid>
                </Container>
            </div>
}