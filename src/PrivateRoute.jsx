import { Navigate } from 'react-router-dom';
import { getToken } from './helpers.js';

const PrivateRoute = ({ element }) => {
  return getToken() ? element : <Navigate to="/accessdenied" />;
};

export default PrivateRoute;