import { Button, Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/defaultImage.jpg';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import AuthorControls from './card/AuthorControls';
import Metadata from './card/Metadata';
import ShelfDropdown from './card/ShelfDropdown';

const RecipeCard = ({ recipe, deleteRecipe, shelfOptions, addRecipeToShelf, handleRemoveRecipeFromShelf }) => {

    const { signedInUser } = useContext(AuthContext);

    const handleAddRecipeToShelf = async (shelfId) => {
        addRecipeToShelf(shelfId, recipe.id);
    }

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
                {shelfOptions && <ShelfDropdown shelfOptions={shelfOptions} handleAddRecipeToShelf={handleAddRecipeToShelf} />}

                {handleRemoveRecipeFromShelf &&
                    <Button onClick={() => handleRemoveRecipeFromShelf(recipe.id)} color='danger' className='position-absolute top-0 end-0'>-</Button>
                }

                <CardBody className='d-flex flex-column'>
                    <CardTitle tag='h5' className='text-center'><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></CardTitle>
                    <CardText className='text-truncate' style={{ maxHeight: '3em', overflow: 'hidden' }}>{recipe.description}</CardText>
                </CardBody>

                {recipe.author && <>
                    {/* Meta Info*/}
                    <Metadata recipe={recipe} />
                    {/* Author controls */}
                    {(recipe.author_id === signedInUser.id) && <AuthorControls recipe={recipe} handleOnDelete={handleOnDelete} />}
                </>}
            </Card>
        </div>
    );
}

RecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired,
    deleteRecipe: PropTypes.func,
    shelfOptions: PropTypes.array,
    addRecipeToShelf: PropTypes.func,
    handleRemoveRecipeFromShelf: PropTypes.func
};

export default RecipeCard;
