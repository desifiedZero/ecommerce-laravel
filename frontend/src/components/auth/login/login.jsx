import React from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

export default function Login(props) {
    const { setName } = useOutletContext();
    setName("Login");

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return <>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{mb: 1.5}}
                autoComplete='off'
                autoFocus
            />
            <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{mb: 1.5}}
                autoComplete='off'
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
                <b>Login</b>
            </Button>
            <span >
                <Link to={"../signup"}>Already have an account?</Link>
            </span>
        </form>
    </>
}