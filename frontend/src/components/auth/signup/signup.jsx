import { Button, TextField } from "@mui/material";
import ApiRoutes from "apiRoutes";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import * as yup from 'yup';
import '../auth.css';

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
    c_password: yup
        .string()
        .required('Please retype the password')
        .oneOf([yup.ref('password')], "Passwords must match")
});

export default function Signup(props) {
    const { setName } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        setName("Signup");
    }, [])

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            c_password: '',
        },
        validationSchema: validationSchema,
            onSubmit: (values) => {
                fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.signup), {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values)
                })
                    .then(data => {
                        if (!data.ok) throw new Error();
                        return data;
                    })
                    .then(data => data.json())
                    .then(data => {
                        localStorage.setItem('auth-token', data.data.token);
                        localStorage.setItem('user-id', data.data.id);
                        localStorage.setItem('username', data.data.name);
                        localStorage.setItem('role', data.data.role);

                        NotificationManager.success(data.message);
    
                        navigate('/');
                    })
                    .catch(error => {
                        NotificationManager.error('Registration failed! Please try again with correct details.');
                    })
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
                id="c_password"
                name="c_password"
                label="Verify Password"
                type="password"
                value={formik.values.c_password}
                onChange={formik.handleChange}
                error={formik.touched.c_password && Boolean(formik.errors.c_password)}
                helperText={formik.touched.c_password && formik.errors.c_password}
                sx={{ mb: 1.5 }}
                autoComplete='off'
            />
            <Button color="primary" variant="contained" fullWidth type="submit">
                <b>Signup</b>
            </Button>
            <span className="appendage">
                <Link to={"../login"}>Already have an account?</Link>
            </span>
        </form>
    </>
}
