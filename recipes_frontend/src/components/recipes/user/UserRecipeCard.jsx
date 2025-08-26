import { Button, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthorControls from '../card/AuthorControls';
import Metadata from '../card/Metadata';
import useAuth from '../../../hooks/useAuth';
import useRecipes from '../../../hooks/useRecipes';
import defaultImage from '../../../assets/defaultImage.jpg';

const UserRecipeCard = ({ recipe }) => {
    const { deleteRecipe } = useRecipes();
    const { signedInUser } = useAuth();

    const deletionConfirmed = (msg) => {
        return window.confirm(msg);
    }

    const handleOnDelete = (id) => {
        if (deletionConfirmed('Are you sure you want to delete this recipe?')) {
            deleteRecipe(id);
        }
    }

    return (
        <div className='p-2 d-flex'>
            <Card style={{ minWidth: '200px', minHeight: '250px', width: '23vw' }}>
                {/* At-a-glance recipe info */}
                <Link to={`/recipes/${recipe.id}`}><CardImg src={recipe.image || defaultImage} alt={recipe.title} style={{ maxHeight: '150px', objectFit: 'cover' }} /></Link>

                <CardBody className='d-flex flex-column'>
                    <CardTitle tag='h5' className='text-center'><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></CardTitle>
                    <CardText className='text-truncate' style={{ maxHeight: '3em', overflow: 'hidden' }}>{recipe.description}</CardText>
                </CardBody>

                {recipe.author && <>
                    {/* Meta Info*/}
                    <Metadata recipe={recipe} />
                    {/* Author controls */}
                    {(recipe.author_id === signedInUser.id) && <AuthorControls recipeId={recipe.id} handleOnDelete={handleOnDelete} />}
                </>}
            </Card>
        </div>
    );
}

UserRecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired
};

export default UserRecipeCard;
