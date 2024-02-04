import React from 'react';
import './App.css';

import {RouterProvider, createBrowserRouter, useRouteError} from 'react-router-dom'

import Login from './Pages/Login.jsx';
import WelcomePage from './Pages/WelcomePage.jsx';
import Register from './Pages/Register.jsx';
import HomePage from './Pages/HomePage.jsx';
import GroupDetailPage from './Pages/GroupDetailPage.jsx';
import CategoryPage from './Pages/CategoryPage.jsx';
import Profil from './Pages/Profil.jsx';
import CreateGroup from './Pages/CreateGroupeForm.jsx'
import Politique from './Pages/Politique.jsx';
import Param from './Pages/Parameters.jsx'
import Favoris from './Pages/Favoris.jsx'import Messagerie from './Pages/Messagerie.jsx'

import PrivateRoute from './PrivateRoute.jsx';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/politique', element: <Politique /> },
  { path: '/', element: <WelcomePage />, errorElement: <PageError /> },
  { path: '/register', element: <Register /> },
  { path: '/home', element: <HomePage />, errorElement: <PageError /> },
  { path: '/group/:id', element: <GroupDetailPage />, errorElement: <PageError /> },
  { path: "/categorie/:categoryName", element: <CategoryPage />, errorElement: <PageError /> },
  { path: '/profil', element: <Profil /> },
  { path: '/messagerie', element: <Messagerie />},
  { path: '/creategroupe', element: <CreateGroup />},
  { path: '/favoris', element: <Favoris />},
  { path: '/parameters', element: <Param />}  { path: '/messagerie', element: <Messagerie />},
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