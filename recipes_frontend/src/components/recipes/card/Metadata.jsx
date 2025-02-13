import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Metadata = ({ recipe }) => {
    return (
        <small>
            <div className='d-flex'>
                <div className='w-25 text-start mx-1'>
                    <div><strong>Uploaded</strong></div>
                    <div>{new Date(recipe.uploaded_at).toLocaleDateString()}</div>
                </div>
                <div className='w-50 text-center mx-auto'>
                    <div><strong>Author</strong></div>
                    <div><Link to={`/profiles/${recipe.author.id}`}>{`${recipe.author.firstName} ${recipe.author.lastName}`}</Link></div>
                </div>
                <div className='w-25 text-end mx-1'>
                    <div><strong>Last Updated</strong></div>
                    <div>{new Date(recipe.last_updated_at).toLocaleDateString()}</div>
                </div>
            </div>
        </small>
    )
}

Metadata.propTypes = {
    recipe: PropTypes.object.isRequired
}

export default Metadata;