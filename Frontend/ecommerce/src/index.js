import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './components/auth/login/login';
import Signup from './components/auth/signup/signup';
import Auth from './components/auth/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/'>
            <Route path='/auth' element={ <Auth /> }>
                <Route path='login' element={ <Login name="Login" /> } />
                <Route path='signup' element={ <Signup name="Signup" /> } />
            </Route>
        </Route>
    )
);

root.render(
    <React.StrictMode>
        <RouterProvider router={ router } />
    </React.StrictMode>
);
