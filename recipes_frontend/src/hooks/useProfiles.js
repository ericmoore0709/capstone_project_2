import { useCallback, useEffect, useState } from "react";
import RecipesApi from "../../api";
import useRecipes from "./useRecipes";

const useProfiles = (token, userId) => {

    const [profile, setProfile] = useState(null);
    const [publicShelf, setPublicShelf] = useState(null);
    const [isBioFormVisible, setIsBioFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { getPublicRecipesByUserId } = useRecipes();

    /**
         * Gets and sets the profile at the given userId
         */
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        // get the profile
        try {
            const result = await RecipesApi.getProfile(userId, token);
            if (result.error) {
                throw result.error;
            } else if (result.profile) {
                // set the profile
                setProfile(result.profile);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, [token, userId]);

    /**
     * Updates a profile
     * @param {*} profile the profile to update
     * @param {*} token the session token
     * @returns the updated profile
     */
    const updateProfile = async (profile, token) => {
        setIsLoading(true);
        try {
            const result = await RecipesApi.updateProfile(profile, token);
            if (result.error) {
                throw new Error(result.error);
            } else if (result.profile) {
                setProfile(result.profile);
                setIsBioFormVisible(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Retrieves public recipes from the user ID (for public shelf)
     */
    const fetchPublicShelf = useCallback(async () => {
        const response = await getPublicRecipesByUserId(userId);
        setPublicShelf({ user_id: userId, recipes: response.recipes });
    }, [getPublicRecipesByUserId, userId]);

    useEffect(() => {
        fetchProfile();
        fetchPublicShelf();
    }, [fetchProfile, fetchPublicShelf]);

    return {
        profile,
        publicShelf,
        isBioFormVisible,
        setIsBioFormVisible,
        updateProfile,
        isLoading
    };
}

export default useProfiles;