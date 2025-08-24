import { CardGroup } from 'reactstrap';
import RecipeCard from './RecipeCard';
import PropTypes from 'prop-types';
import Loading from '../util/Loading';

const RecipeList = ({ title, recipes, loading, deleteRecipe, shelfOptions, addRecipeToShelf }) => {

    if (loading) return <Loading />;

    return (
        <div>
            <h2 className='text-center mt-2'>{title}</h2>

            {/* Show message if there are no recipes to display */}
            {recipes.length === 0 && (
                <p className="text-center my-3">No recipes to display.</p>
            )}

            {/* Render recipes if available */}
            <CardGroup className='d-flex flex-wrap m-1 w-100 justify-content-center'>
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        deleteRecipe={deleteRecipe}
                        shelfOptions={shelfOptions}
                        addRecipeToShelf={addRecipeToShelf}
                    />
                ))}
            </CardGroup>
        </div>
    );
}

RecipeList.propTypes = {
    title: PropTypes.string.isRequired,
    recipes: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    deleteRecipe: PropTypes.func,
    shelfOptions: PropTypes.array,
    addRecipeToShelf: PropTypes.func
};

export default RecipeList;
