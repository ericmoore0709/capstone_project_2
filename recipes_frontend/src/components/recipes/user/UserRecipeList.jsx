import { CardGroup } from 'reactstrap';
import UserRecipeCard from './UserRecipeCard';
import useRecipes from '../../../hooks/useRecipes';
import Loading from '../../util/Loading';

const UserRecipeList = () => {
    const { userLoading: loading, userRecipes: recipes } = useRecipes();

    if (loading) return <Loading />;
    return (
        <div>
            <h2 className='text-center mt-2'>My Recipes</h2>

            {/* Show message if there are no recipes to display */}
            {recipes.length === 0 && (
                <p className="text-center my-3">No recipes to display.</p>
            )}

            {/* Render recipes if available */}
            <CardGroup className='d-flex flex-wrap m-1 w-100 justify-content-center'>
                {recipes.map((recipe) => (
                    <UserRecipeCard
                        key={recipe.id}
                        recipe={recipe}
                    />
                ))}
            </CardGroup>
        </div>
    );
}

UserRecipeList.propTypes = {};

export default UserRecipeList;
