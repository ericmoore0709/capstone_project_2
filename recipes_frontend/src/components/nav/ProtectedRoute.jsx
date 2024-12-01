import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Encapsulates route and redirects unauthed user to landing page
 * @param {*} param0 
 * @returns 
 */
const ProtectedRoute = ({ element }) => {
    const navigate = useNavigate();
    const { signedInUser } = useAuth(navigate);

    return signedInUser ? element : navigate('/');
};

ProtectedRoute.propTypes = {
    signedInUser: PropTypes.object,
    element: PropTypes.object.isRequired
};

export default ProtectedRoute;