import { useCallback, useEffect, useState } from "react";
import RecipesApi from "../../api";

const useShelves = (signedInUser, token, setClientMessage, navigate) => {
    const [userShelves, setUserShelves] = useState([]);
    const [shelfFormErrors, setShelfFormErrors] = useState([]);

    useEffect(() => {
        fetchUserShelves();
    }, [fetchUserShelves]);

    /**
         * Fetch user shelves, set user shelves state
         */
    const fetchUserShelves = useCallback(async () => {
        if (signedInUser?.id && token) {
            try {
                const apiShelves = await RecipesApi.getUserShelves(signedInUser.id, token);
                setUserShelves(apiShelves);
            } catch (err) {
                console.error('Error fetching user shelves:', err);
            }
        }
    }, [signedInUser.id, token]);

    // shelf functions

    /**
     * Adds a shelf to the user's shelves
     * @param {*} shelf the shelf to add
     * @returns navigates to previous page
     */
    const addShelf = async (shelf) => {
        try {
            const result = await RecipesApi.createNewShelf(shelf, token);
            if (result.error) {
                setShelfFormErrors([result.error]);
            } else if (result.shelf) {
                const createdShelf = result.shelf;
                // update shelf list states
                setUserShelves([createdShelf, ...userShelves]);

                // clear errors and provide success message
                setShelfFormErrors([]);
                setClientMessage({ color: 'success', message: "Shelf added successfully." });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong adding a shelf.');
            }
        } catch (err) {
            console.log("Error adding shelf:", err);
        }
    };

    /**
     * Updates user's shelf
     * @param {*} shelf the shelf to update 
     * @returns navigates to previous page
     */
    const updateShelf = async (shelf) => {
        try {
            const result = await RecipesApi.updateShelf(shelf, token);
            if (result.error) {
                setShelfFormErrors(result.error);
            } else if (result.shelf) {
                const updatedShelf = result.shelf;
                // update shelf list states
                const remainingUserShelves = userShelves.filter((shelf) => shelf.id !== updatedShelf.id);
                setUserShelves([updatedShelf, ...remainingUserShelves]);

                // clear errors and provide success message
                setShelfFormErrors([]);
                setClientMessage({ color: 'success', message: "Shelf updated successfully." });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong updating a shelf.');
            }
        } catch (err) {
            console.log("Error updating shelf:", err);
        }
    };

    /**
     * Delete's user's shelf
     * @param {*} id the shelf ID
     */
    const deleteShelf = async (id) => {
        try {
            const result = await RecipesApi.deleteShelf(id, token);
            if (result.shelf) {
                const deletedShelf = result.shelf;
                // update shelf list states
                setUserShelves(userShelves.filter((shelf) => shelf.id !== deletedShelf.id));

                // clear errors and set success message
                setShelfFormErrors([]);
                setClientMessage({ color: 'success', message: "Shelf deleted successfully." });
            } else {
                throw new Error('Something went wrong deleting a shelf');
            }
        } catch (err) {
            console.log('Error deleting shelf: ', err);
        }
    }

    /**
   * Adds recipe to shelf
   * @param {*} shelfId the shelf ID
   * @param {*} recipeId the recipe ID
   */
    const addRecipeToShelf = async (shelfId, recipeId) => {
        try {
            const result = await RecipesApi.addShelfRecipe(shelfId, recipeId, token);
            if (result.error) {
                // handle error
                setClientMessage({ color: 'danger', message: 'Cannot add recipe to shelf.' });
            } else if (result.shelf) {
                // add shelf to userShelves state
                const updatedShelf = result.shelf;
                // update shelf list states
                const remainingUserShelves = userShelves.filter((shelf) => shelf.id !== updatedShelf.id);
                setUserShelves([updatedShelf, ...remainingUserShelves]);
                setClientMessage({ color: 'success', message: 'Recipe added to shelf.' });
            }
        } catch (err) {
            console.log('Error adding recipe to shelf:', err);
            setClientMessage({ color: 'danger', message: 'Failed to add recipe to shelf.' });
        }
    }

    /**
     * Removes recipe from shelf
     * @param {*} shelfId the shelf ID
     * @param {*} recipeId the recipe ID
     */
    const removeRecipeFromShelf = async (shelfId, recipeId) => {
        try {
            const result = await RecipesApi.removeShelfRecipe(shelfId, recipeId, token);
            if (result.error) {
                // handle error
                setClientMessage({ color: 'danger', message: 'Cannot remove recipe from shelf.' });
            } else if (result.shelf) {
                // add shelf to userShelves state
                const updatedShelf = result.shelf;
                // update shelf list states
                const remainingUserShelves = userShelves.filter((shelf) => shelf.id !== updatedShelf.id);
                setUserShelves([updatedShelf, ...remainingUserShelves]);
                setClientMessage({ color: 'success', message: 'Recipe removed from shelf.' });
            }
        } catch (err) {
            console.log('Error removing recipe from shelf:', err);
            setClientMessage({ color: 'danger', message: 'Failed to remove recipe from shelf.' });
        }
    }

    return {
        userShelves,
        fetchUserShelves,
        shelfFormErrors,
        addShelf,
        updateShelf,
        deleteShelf,
        addRecipeToShelf,
        removeRecipeFromShelf
    };
}

export default useShelves;