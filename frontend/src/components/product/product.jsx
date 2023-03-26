import { Button, Container, Grid } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";

import "./product.css";

export default function Product() {
    const { id } = useParams();

    const [product, setProduct] = useState({});

    useEffect(() => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.allProducts).concat("/" + id))
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setProduct(data.data);
            })
            .catch(err => {
                NotificationManager.error("There was a problem loading the data. Please try again in a while.")
            })
    }, []);

    return <div className="top-fix">
        <Container maxWidth="1000px">
            <Grid container className="product-page" spacing={4}>
                <Grid item sm="6">
                    <div className="image-container">
                        <img src="https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png" alt="Product" />
                    </div>
                </Grid>
                <Grid item sm="6">
                    <h2 className="title">{product.name}</h2>
                    <p>{product.description}</p>
                    <span style={{color: '#2a3', fontWeight: 'bold', fontSize: '2rem'}}>Rs. {product.price}</span>
                    <div style={{padding: '1rem 0'}}><Button size="large" variant="contained" color="success">Buy Now</Button></div>
                </Grid>
            </Grid>
        </Container>
    </div>
}