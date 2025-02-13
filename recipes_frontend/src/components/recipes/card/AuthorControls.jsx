import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PropTypes from 'prop-types';


const AuthorControls = ({ recipe, handleOnDelete }) => {

    return (
        <div className='text-center'>
            <Link to={`/recipes/${recipe.id}/edit`} className='w-50 btn btn-secondary mb-1'>Edit</Link>
            <Button color='danger' className='w-50 mb-1' onClick={() => handleOnDelete(recipe.id)}>Delete</Button>
        </div>
    )
}

AuthorControls.propTypes = {
    recipe: PropTypes.object.isRequired,
    handleOnDelete: PropTypes.func.isRequired
}

export default AuthorControls;