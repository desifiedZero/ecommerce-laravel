import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, InputBase, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    return <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', margin: '1.3rem 0'}}
        onSubmit={e => {
            e.preventDefault();
            navigate('/search/' + search)
        }}
        >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            fullWidth
            value={search}
            onChange={(event) => {
                setSearch(event.target.value);
            }}
            endAdornment={
                <IconButton 
                    type="button" 
                    sx={{ p: '10px' }} 
                    aria-label="search" 
                    color="primary">
                    <Search />
                </IconButton>
            }
        />
    </Paper>;
}