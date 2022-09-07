import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Home from './page/Home';
import NotFound from './page/NotFound';
import UserEdit from './page/user/UserEdit';
import Users from './page/user/Users';


const GetRoutes = () => {
    const routes = useRoutes(
        [
            { index: true, element: <Home /> },
            {
                path: '/users', element: <Users />
            }, {
                path: '/user-edit/:id', element: <UserEdit />
            },
            { path: '*', element: <NotFound /> }
        ]
    );

    return routes;
}

const InitRoutes = () => {
    return (
        <BrowserRouter>
            <GetRoutes />
        </BrowserRouter>
    )
}

export default InitRoutes;