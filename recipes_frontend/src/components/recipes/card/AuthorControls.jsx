import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PropTypes from 'prop-types';


const AuthorControls = ({ recipeId, handleOnDelete }) => {
    return (
        <div className='text-center'>
            <Link to={`/recipes/${recipeId}/edit`} className='w-50 btn btn-secondary mb-1'>Edit</Link>
            <Button color='danger' className='w-50 mb-1' onClick={() => handleOnDelete(recipeId)}>Delete</Button>
        </div>
    )
}

AuthorControls.propTypes = {
    recipeId: PropTypes.number.isRequired,
    handleOnDelete: PropTypes.func.isRequired
}

export default AuthorControls;