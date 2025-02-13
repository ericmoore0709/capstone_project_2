import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import RecipeCard from '../recipes/RecipeCard';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Shelf = ({ shelf, deleteShelf, removeRecipeFromShelf }) => {
    const handleRemoveRecipeFromShelf = (recipeId) => {
        removeRecipeFromShelf(shelf.id, recipeId);
    }

    const deletionConfirmed = (msg) => {
        return window.confirm(msg);
    }

    const handleOnDelete = (id) => {
        if (deletionConfirmed('Are you sure you want to delete this shelf?')) {
            deleteShelf(id);
        }
    }

    return (
        <div className='w-100 p-2'>
            <Card style={{ minHeight: '250px' }}>
                <CardTitle className='text-center'>{shelf.label} <small className='text-secondary'>Recipes: {shelf.recipes?.length || 0}</small></CardTitle>
                <CardBody className='d-flex overflow-auto'>
                    {<>
                        {shelf.recipes?.map((recipe) =>
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                handleRemoveRecipeFromShelf={removeRecipeFromShelf ? handleRemoveRecipeFromShelf : null} />
                        )}
                    </>}
                </CardBody>
                {removeRecipeFromShelf &&
                    <div className='mx-auto mt-auto'>
                        <NavLink className='btn btn-secondary mx-1' to={`/shelves/${shelf.id}/edit`}>Edit</NavLink>
                        <Button className='mx-1' color='danger' onClick={() => handleOnDelete(shelf.id)}>Delete</Button>
                    </div>
                }
            </Card>
        </div>
    );
}

Shelf.propTypes = {
    shelf: PropTypes.object,
    deleteShelf: PropTypes.func,
    removeRecipeFromShelf: PropTypes.func
};

export default Shelf;
