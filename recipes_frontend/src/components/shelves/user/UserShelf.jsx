import { Card, CardBody, CardTitle } from 'reactstrap';
import RecipeCard from '../../recipes/RecipeCard';
import PropTypes from 'prop-types';
import useShelves from '../../../hooks/useShelves';
import AuthorControls from '../AuthorControls';

const UserShelf = ({ shelf }) => {
    const { removeRecipeFromShelf } = useShelves();

    const handleRemoveRecipeFromShelf = (recipeId) => {
        removeRecipeFromShelf(shelf.id, recipeId);
    }

    return (
        <div className='w-100 p-2'>
            <Card style={{ minHeight: '250px' }}>
                <CardTitle className='text-center'>{shelf.label} <small className='text-secondary'>Recipes: {shelf.recipes?.length || 0}</small></CardTitle>
                <CardBody className='d-flex overflow-auto'>
                    {shelf.recipes?.map((recipe) =>
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            handleRemoveRecipeFromShelf={handleRemoveRecipeFromShelf} />
                    )}
                </CardBody>
                <AuthorControls shelfId={shelf.id} />
            </Card>
        </div>
    );
}

UserShelf.propTypes = {
    shelf: PropTypes.object.isRequired
};

export default UserShelf;
