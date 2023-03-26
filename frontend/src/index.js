import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

import Login from './components/auth/login/login';
import Signup from './components/auth/signup/signup';
import Auth from './components/auth/auth';
import Homepage from 'components/homepage/homepage';

import 'react-notifications/lib/notifications.css';
import './index.css';
import BaseLayout from 'components/common/baseLayout/baseLayout';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Product from 'components/product/product';
import User from 'components/user/user';

const root = ReactDOM.createRoot(document.getElementById('root'));

// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route path='/'>
//             <Route path='auth' element={ <Auth /> }>
//                 <Route path='login' element={ <Login name="Login" /> } />
//                 <Route path='signup' element={ <Signup name="Signup" /> } />
//             </Route>
//         </Route>
//     )
// );

const router = createBrowserRouter([
    {
        path: '',   
        element: <BaseLayout />,
        children: [
            {
                path: "",
                element: <Homepage />,
            },
            {
                path: "product/:id",
                element: <Product />,
            },
            ,
            {
                path: "user",
                element: <User />,
            }
        ]
    },
    {
        path: "auth",
        element: <Auth />,
        children: [
            {
                path: "login",
                element: <Login name="Login" />,
            },
            {
                path: "signup",
                element: <Signup name="Signup" />,
            }
        ]
    },
]);
  

root.render(
    <React.StrictMode>
        <ProSidebarProvider>
            <RouterProvider router={ router } />
        </ProSidebarProvider>

        <NotificationContainer/>
    </React.StrictMode>
);
