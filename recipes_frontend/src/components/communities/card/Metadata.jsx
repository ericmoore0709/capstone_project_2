import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Metadata = ({ community }) => {
    return (
        <small>
            <div className='d-flex'>
                <div className='w-25 text-start mx-1'>
                    <div><strong>Created</strong></div>
                    <div>{new Date(community.created_at).toLocaleDateString()}</div>
                </div>
                <div className='w-50 text-center mx-auto'>
                    <div><strong>Admin</strong></div>
                    <div><Link to={`/profiles/${community.admin.id}`}>{`${community.admin.firstName} ${community.admin.lastName}`}</Link></div>
                </div>
                <div className='w-25 text-end mx-1'>
                    <div><strong>Last Updated</strong></div>
                    <div>{new Date(community.last_updated_at).toLocaleDateString()}</div>
                </div>
            </div>
        </small>
    )
}

Metadata.propTypes = {
    community: PropTypes.object
};

export default Metadata;