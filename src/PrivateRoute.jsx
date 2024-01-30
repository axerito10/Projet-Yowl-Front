import { Navigate } from 'react-router-dom';
import { getToken } from './services/helpers.js';

const PrivateRoute = ({ element }) => {
  return getToken() ? element : <Navigate to="/accessdenied" />;
};

export default PrivateRoute;