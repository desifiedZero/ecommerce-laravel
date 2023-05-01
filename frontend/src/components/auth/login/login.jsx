import React, { useEffect } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from "@mui/material";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import ApiRoutes from "apiRoutes";
import '../auth.css';

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
    const navigate = useNavigate();

    useEffect(() => {
        setName("Login");
    }, [])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            fetch(process.env.REACT_APP_BASE_URL.concat(ApiRoutes.login), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
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

                    if (String(data.data.role).toLowerCase() == 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                })
                .catch(error => {
                    NotificationManager.error('Login failed! Please try again with correct credentials.');
                });
        }
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
            <span className="appendage">
                <Link to={"../signup"}>Already have an account?</Link>
            </span>
        </form>
    </>
}