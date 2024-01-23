import React from 'react';
import './App.css';

import {RouterProvider, createBrowserRouter, useRouteError} from 'react-router-dom'

import Login from './Pages/Login.jsx'

import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Login />, errorElement: <PageError /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

function PageError() {
  const error = useRouteError()
  return (
    <>
      <h1>Désolé, la page auquel vous essayez d'accéder est indisponible ou n'existe pas</h1>
      <p>
        {error?.error?.toString() ?? error?.toString()}
      </p>
    </>
  )
}

export default App