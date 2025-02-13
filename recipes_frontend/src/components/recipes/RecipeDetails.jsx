import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'reactstrap';
import useRecipes from '../../hooks/useRecipes';
import Loading from '../util/Loading';
import defaultImage from '../../assets/defaultImage.jpg';

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
        <div className="container mt-4">
            {isLoading && <Loading />}
            {error && <Alert color="danger" className="text-center">{error}</Alert>}

            {(recipe && !error) && <>
                <h1 className="text-center">{recipe.title}</h1>
                <p className="text-muted text-center">{recipe.description}</p>

                <div className="text-center my-3">
                    <img src={recipe.image || defaultImage} alt={`${recipe.title} image`} className="img-fluid rounded w-25" />
                </div>

            </>}

            {(!isLoading && !recipe) && <h2 className="text-center my-4">Recipe Not Found</h2>}
        </div>
    );
};

export default RecipeDetails;
