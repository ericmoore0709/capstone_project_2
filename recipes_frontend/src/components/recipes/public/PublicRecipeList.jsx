import useRecipes from "../../../hooks/useRecipes";
import Loading from "../../util/Loading";
import PublicRecipeCard from "./PublicRecipeCard";
import { CardGroup } from 'reactstrap';

const PublicRecipeList = () => {
    const { publicRecipes: recipes, publicLoading: loading } = useRecipes();

    if (loading) return <Loading />

    return (
        <>
            <h2 className="text-center mt-2">Public Recipes</h2>

            {/* Show message if there are no recipes to display */}
            {recipes.length === 0 && (
                <p className="text-center my-3">No recipes to display.</p>
            )}

            {/* Render recipes if available */}
            <CardGroup className='d-flex flex-wrap m-1 w-100 justify-content-center'>
                {recipes.map((recipe) => (
                    <PublicRecipeCard
                        key={recipe.id}
                        recipe={recipe}
                    />
                ))}
            </CardGroup>
        </>
    );
}

export default PublicRecipeList;