import { useCallback, useContext, useEffect, useState } from "react";
import RecipesApi from "../../api";
import useShelves from "./useShelves";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { AuthContext } from "../contexts/AuthContext";

const useRecipes = (setClientMessage) => {

    const [publicRecipes, setPublicRecipes] = useState([]);
    const [userRecipes, setUserRecipes] = useState([]);
    const [recipeFormErrors, setRecipeFormErrors] = useState([]);

    const { signedInUser, token } = useContext(AuthContext);
    const { fetchUserShelves } = useShelves(setClientMessage);

    const navigate = useNavigate();

    /** Fetch public recipes and update publicRecipes state. */
    const fetchPublicRecipes = useCallback(async () => {
        try {
            const apiRecipes = await RecipesApi.getAllPublicRecipes(token);
            setPublicRecipes(apiRecipes);
        } catch (error) {
            console.error("Error fetching public recipes:", error);
        }
    }, [token]);

    /**
     * Fetch user recipes, set userRecipes state
     */
    const fetchUserRecipes = useCallback(async () => {
        if (signedInUser?.id && token) {
            try {
                const apiRecipes = await RecipesApi.getUserRecipes(signedInUser.id, token);
                setUserRecipes(apiRecipes);
            } catch (error) {
                console.error("Error fetching user recipes:", error);
            }
        }
    }, [signedInUser?.id, token]);

    /** Update user recipes state upon sign-in. */
    useEffect(() => {
        fetchPublicRecipes();
        fetchUserRecipes();
    }, [fetchPublicRecipes, fetchUserRecipes]);

    // recipe functions

    /**
     * Add recipe to user's recipes
     * @param {*} recipe the recipe to add
     * @returns navigates to previous page
     */
    const addRecipe = async (recipe) => {
        try {
            const result = await RecipesApi.createNewRecipe(recipe, token);
            if (result.error) {
                setRecipeFormErrors(result.error);
            } else if (result.recipe) {
                const createdRecipe = result.recipe;
                // update recipe list states
                setUserRecipes([createdRecipe, ...userRecipes]);
                if (createdRecipe.visibility_id === 1) {
                    setPublicRecipes([createdRecipe, ...publicRecipes]);
                }

                // clear errors and provide success message
                setRecipeFormErrors([]);
                setClientMessage({ color: 'success', message: "Recipe added successfully." });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong adding a recipe.');
            }
        } catch (err) {
            console.log("Error adding recipe:", err);
        }
    };

    const getRecipeById = useCallback(async (id) => {
        try {
            const result = await RecipesApi.getRecipeById(+id, token);
            return result;
        } catch (err) {
            console.log('Error getting recipe:', err);
            throw err;
        }
    }, [token]);

    /**
     * Gets all public recipes authored by the user
     * @param {*} userId the ID of the user
     * @returns a list of public recipes
     */
    const getPublicRecipesByUserId = useCallback(async (userId) => {
        try {
            const response = await RecipesApi.getUserPublicRecipes(userId, token);
            return response;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }, [token]);

    /**
    * Updates a user's recipe
    * @param {*} recipe the recipe to update
    * @returns navigates to previous page
    */
    const updateRecipe = async (recipe) => {
        try {
            delete recipe.author_id;
            delete recipe.uploaded_at;
            delete recipe.last_updated_at;

            const result = await RecipesApi.updateRecipe(recipe, token);

            if (result.error) {
                setRecipeFormErrors(result.error);
            } else if (result.recipe) {
                const updatedRecipe = result.recipe;
                // update recipe list states
                const remainingUserRecipes = userRecipes.filter((recipe) => recipe.id !== updatedRecipe.id);
                setUserRecipes([updatedRecipe, ...remainingUserRecipes]);

                const remainingPublicRecipes = publicRecipes.filter((recipe) => recipe.id !== updatedRecipe.id);
                if (updatedRecipe.visibility_id === 1) {
                    setPublicRecipes([updatedRecipe, ...remainingPublicRecipes]);
                } else {
                    setPublicRecipes(remainingPublicRecipes);
                }

                // clear errors and set success message
                setRecipeFormErrors([]);
                setClientMessage({ color: 'success', message: "Recipe updated successfully." });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong updating a recipe.');
            }
        } catch (err) {
            console.log("Error adding recipe:", err);
        }
    };

    /**
    * Deletes a user's recipe
    * @param {*} id the recipe ID
    */
    const deleteRecipe = async (id) => {
        try {
            const result = await RecipesApi.deleteRecipe(id, token);
            if (result.recipe) {
                const deletedRecipe = result.recipe;
                // update recipe list states
                setUserRecipes(userRecipes.filter((recipe) => recipe.id !== deletedRecipe.id));
                if (deletedRecipe.visibility_id === 1) {
                    setPublicRecipes(publicRecipes.filter((recipe) => recipe.id !== deletedRecipe.id));
                }

                // update shelves to reflect lack of this recipe (if applicable)
                await fetchUserShelves();

                // clear errors and set success message
                setRecipeFormErrors([]);
                setClientMessage({ color: 'success', message: "Recipe deleted successfully." });
            } else {
                throw new Error('Something went wrong deleting a recipe');
            }
        } catch (err) {
            console.log('Error deleting recipe: ', err);
        }
    }

    return {
        publicRecipes,
        userRecipes,
        recipeFormErrors,
        setRecipeFormErrors,
        setPublicRecipes,
        setUserRecipes,
        addRecipe,
        getRecipeById,
        getPublicRecipesByUserId,
        updateRecipe,
        deleteRecipe
    };
}

export default useRecipes;