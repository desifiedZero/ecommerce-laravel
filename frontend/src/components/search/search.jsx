import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import ApiRoutes from "apiRoutes";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Link, useParams } from "react-router-dom";

import './home.css'
import SearchBar from "components/common/searchbar";

export default function SearchPage(props) {
    const [fetchedProducts, setFetchedProducts] = useState(false);
    const [products, setProducts] = useState(<></>);
    const [search, setSearch] = useState("");

    const { query } = useParams();

    useEffect(() => {
        if (query != search) {
            setSearch(query);
            setFetchedProducts(false);
        }

        if (!fetchedProducts) {
            fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.searchProducts + "/" + query))
            .then(x => {
                if (x.ok) return x.json();
                throw new Error();
            })
            .then(data => {
                setFetchedProducts(true);
                setProducts(data.data.map((item) => {
                    return <Grid item sm={4} md={3} className="product-item">
                        <Link to={"/product/".concat(item.id)}>
                            <div className="image-container">
                                <img src={process.env.REACT_APP_BACKEND_URL + item.image} alt="" />
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
        }
    });

    return <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                <Container>
                    <SearchBar />

                    <h1>Search</h1>
                    <Grid container spacing={2}>
                        {products}
                    </Grid>
                </Container>
            </div>;
}