import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Encapsulates route and redirects unauthed user to landing page
 * @param {*} param0 
 * @returns 
 */
const ProtectedRoute = ({ element }) => {
    const signedInUser = useContext(AuthContext);

    return signedInUser ? element : <h1>Landing Page</h1>;
};

ProtectedRoute.propTypes = {
    element: PropTypes.object.isRequired
};

export default ProtectedRoute;