import { useCallback, useEffect, useState } from "react";
import RecipesApi from "../../api";
import useShelves from "./useShelves";

const useRecipes = (signedInUser, token, setClientMessage, navigate) => {

    const [publicRecipes, setPublicRecipes] = useState([]);
    const [userRecipes, setUserRecipes] = useState([]);
    const [recipeFormErrors, setRecipeFormErrors] = useState([]);

    const { fetchUserShelves } = useShelves(signedInUser, token, setClientMessage, navigate);

    useEffect(() => {
        /** Fetch public recipes and update publicRecipes state. */
        const fetchPublicRecipes = async () => {
            try {
                const apiRecipes = await RecipesApi.getAllPublicRecipes();
                setPublicRecipes(apiRecipes);
            } catch (error) {
                console.error("Error fetching public recipes:", error);
            }
        };
        fetchPublicRecipes();
    }, []);

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
        fetchUserRecipes();
    }, [fetchUserRecipes]);

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
                if (updatedRecipe.visibility_id === 1) {
                    const remainingPublicRecipes = publicRecipes.filter((recipe) => recipe.id !== updatedRecipe.id);
                    setPublicRecipes([updatedRecipe, ...remainingPublicRecipes]);
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
        updateRecipe,
        deleteRecipe
    };
}

export default useRecipes;