import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

/**
 * Encapsulates route and redirects unauthed user to landing page
 * @param {*} param0 
 * @returns 
 */
const ProtectedRoute = ({ element }) => {
    const { signedInUser } = useAuth();

    return signedInUser ? element : <h1>Landing Page</h1>;
};

ProtectedRoute.propTypes = {
    signedInUser: PropTypes.object,
    element: PropTypes.object.isRequired
};

export default ProtectedRoute;