import React from 'react';
import './App.css';
import { firestore } from './services/firebase.js';
import { AuthProvider } from './services/AuthContext.jsx';
import {RouterProvider, createBrowserRouter, useRouteError} from 'react-router-dom'

import Login from './Pages/Login.jsx'
import WelcomePage from './Pages/WelcomePage.jsx'
import Register from './Pages/Register.jsx'
import Profil from './Pages/Profil.jsx'
import Messagerie from './Pages/Messagerie.jsx'


import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: <WelcomePage />, errorElement: <PageError /> },
  { path: '/register', element: <Register /> },
  { path: '/profil', element: <Profil /> },
  { path: '/messagerie', element: <Messagerie /> },

]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>  
  )
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