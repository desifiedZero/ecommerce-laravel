import { Box, Button, Container, Grid, Rating, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Navigate, redirect, useNavigate, useOutletContext, useParams } from "react-router-dom";

import "./product.css";

export default function Product(props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const { setOpen, updateCart } = useOutletContext();

    const [product, setProduct] = useState({});
    const [reviews, setReviews] = useState(<></>);
    const [reviewData, setReviewData] = useState("");
    const [rating, setRating] = useState(0);

    const addToCart = () => {
        setOpen(true);
        NotificationManager.success("Item has been added to cart successfully");
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.allProducts).concat("/" + id), {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('auth-token')
            }
        })
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setProduct(data.data);
            })
            .catch(err => {
                console.log(err);
                NotificationManager.error("There was a problem loading the data. Please try again in a while.")
            })
    }, []);

    useEffect(() => {
        setReviews(product.reviews?.map(x => {
            console.log(x);
            return <Grid item xs={12}>
                <h3>{x.username}</h3>
                <Rating name="read-only" value={x.rating} readOnly />
                <p>{x.text == '-' ? '' : x.text}</p>
                <hr />
            </Grid>;
        }))
    }, [product])
    

    return <div className="top-fix">
        <Container>
            <Grid container className="product-page" spacing={4}>
                <Grid item sm="6">
                    <div className="image-container">
                        <img src={process.env.REACT_APP_BACKEND_URL + product?.image} alt="Product" />
                    </div>
                </Grid>
                <Grid item sm="6">
                    <h2 className="title">{product?.name}</h2>
                    <p>{product?.description}</p>
                    <span style={{color: '#2a3', fontWeight: 'bold', fontSize: '2rem'}}>Rs. {product?.price}</span>
                    <div style={{padding: '1rem 0'}}>
                        <Button 
                        size="large" 
                        variant="outlined" 
                        color="success" 
                        disabled={!product?.name}
                        onClick={() => {
                            if (localStorage.getItem('auth-token') && localStorage.getItem('username')) {
                                updateCart(id); 
                                addToCart();
                                return;
                            }

                            navigate('/auth/login')
                        }}
                        >Add to cart</Button>
                    </div>
                </Grid>
            </Grid>
            <Grid container className="product-page" spacing={4}>
                <Grid item sm={12}>
                    {localStorage.getItem('auth-token') && product?.allowReviews && <Box marginBottom={2}>
                        <h3>Rate this product</h3>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event) => {
                                setRating(event.target.value);
                            }}
                        />
                        <TextField
                            fullWidth
                            id="outline-disabled"
                            label="Description"
                            multiline
                            rows={4}
                            value={reviewData}
                            onChange={(e) => {
                                setReviewData(e.target.value);
                            }}
                            margin={'dense'}
                        />
                        <Button 
                            onClick={() => {
                                if (rating == 0) {
                                    NotificationManager.error("Please add the rating for the product");
                                    return;
                                }

                                fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.submitReview), {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + localStorage.getItem('auth-token'),
                                    },
                                    method: 'POST',
                                    body: JSON.stringify({
                                        "product_id": product?.id,
                                        "text": reviewData,
                                        "rating": Number(rating),
                                    })
                                })
                                    .then(x => {
                                        if (x.ok) return x.json();
                                        throw new Error(x.json());
                                    })
                                    .then(data => {
                                        NotificationManager.success("Review submitted successfully.")
                                    })
                                    .catch(err => {
                                        NotificationManager.error("Could not submit review.")
                                    })
                            }}
                            variant="outlined"
                            color='primary'
                            fullWidth>
                            Add Review
                        </Button>
                    </Box>}
                    <h1>Reviews</h1>
                    {(reviews?.length > 0 && reviews) || <Box>No reviews found</Box>}
                </Grid>
            </Grid>
        </Container>
    </div>
}