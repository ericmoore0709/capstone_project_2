import { Button } from "reactstrap";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import useShelves from '../../hooks/useShelves';

const AuthorControls = ({ shelfId }) => {
    const { deleteShelf } = useShelves();

    const deletionConfirmed = (msg) => {
        return window.confirm(msg);
    }

    const handleOnDelete = (id) => {
        if (deletionConfirmed('Are you sure you want to delete this shelf?')) {
            deleteShelf(id);
        }
    }

    return (
        <div className='mx-auto mt-auto'>
            <NavLink className='btn btn-secondary mx-1' to={`/shelves/${shelfId}/edit`}>Edit</NavLink>
            <Button className='mx-1' color='danger' onClick={() => handleOnDelete(shelfId)}>Delete</Button>
        </div>
    );
}

AuthorControls.propTypes = {
    shelfId: PropTypes.number.isRequired
};

export default AuthorControls;