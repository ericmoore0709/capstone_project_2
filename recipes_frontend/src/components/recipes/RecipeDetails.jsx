import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'reactstrap';
import useRecipes from '../../hooks/useRecipes';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getRecipeById } = useRecipes();

    useEffect(() => {
        const fetchRecipe = async (id) => {
            setIsLoading(true);
            setError(null);

            try {
                const fetchedRecipe = await getRecipeById(id);
                setRecipe(fetchedRecipe || null);
            } catch (err) {
                console.error("Error fetching recipe:", err);
                setError("Failed to load recipe details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe(id);
    }, [id, getRecipeById]);

    return (
        <div className="recipe-details container mt-4">
            {isLoading ? (
                <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" className="d-block mx-auto my-4" />
            ) : error ? (
                <Alert color="danger" className="text-center">{error}</Alert>
            ) : recipe ? (
                <>
                    <h1 className="text-center">{recipe.title}</h1>
                    <p className="text-muted text-center">{recipe.description}</p>
                    {recipe.image && (
                        <div className="text-center my-3">
                            <img src={recipe.image} alt={`${recipe.title} image`} className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                        </div>
                    )}
                </>
            ) : (
                <h2 className="text-center my-4">Recipe Not Found</h2>
            )}
        </div>
    );
};

export default RecipeDetails;
