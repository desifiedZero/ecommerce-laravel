import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import * as yup from 'yup';

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Full Name is reuqired'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    verifyPassword: yup
        .string()
        .required('Please retype the password')
        .oneOf([yup.ref('password')], "Passwords must match")
});

export default function Signup(props) {
    const { setName } = useOutletContext();
    setName("Signup");

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            verifyPassword: '',
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
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ mb: 1.5 }}
                autoComplete='off'
                autoFocus
            />
            <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ mb: 1.5 }}
                autoComplete='off'
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
                sx={{ mb: 1.5 }}
                autoComplete='off'
            />
            <TextField
                fullWidth
                id="verifyPassword"
                name="verifyPassword"
                label="Verify Password"
                type="password"
                value={formik.values.verifyPassword}
                onChange={formik.handleChange}
                error={formik.touched.verifyPassword && Boolean(formik.errors.verifyPassword)}
                helperText={formik.touched.verifyPassword && formik.errors.verifyPassword}
                sx={{ mb: 1.5 }}
                autoComplete='off'
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
                <b>Signup</b>
            </Button>
            <span >
                <Link to={"../login"}>Already have an account?</Link>
            </span>
        </form>
    </>
}
