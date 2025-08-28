import { useCallback, useEffect, useState } from "react";
import CommunitiesContext from "../contexts/CommunitiesContext";
import RecipesApi from "../../api";
import useNotification from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CommunitiesProvider = ({ children }) => {
    const { signedInUser, token } = useAuth();
    const { setClientMessage } = useNotification();
    const navigate = useNavigate();

    const [publicCommunities, setPublicCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    /**
     * Fetches a list of public communities from the server.
     */
    const fetchPublicCommunities = useCallback(async () => {
        setLoading(true);
        try {
            const communities = await RecipesApi.getAllCommunities(token);
            if (communities) setPublicCommunities(communities);
            else setPublicCommunities([]);
        } catch (err) {
            console.error('Error fetching public communities:', err);
            setPublicCommunities([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchUserCommunities = useCallback(async () => {
        setLoading(true);
        if (signedInUser?.id && token) {
            try {
                const communities = await RecipesApi.getCommunitiesByUserId(signedInUser?.id, token);
                if (communities) setUserCommunities(communities);
                else setUserCommunities([]);
            } catch (err) {
                console.error('Error fetching user communities:', err);
                setUserCommunities([]);
            } finally {
                setLoading(false);
            }
        }
    }, [signedInUser, token]);

    useEffect(() => {
        fetchPublicCommunities();
        fetchUserCommunities();
    }, [fetchPublicCommunities, fetchUserCommunities]);

    /**
     * Adds a community to the website.
     * @param {*} community the commnity to add
     * @returns navigates to previous page
     */
    const addCommunity = async (community) => {
        try {
            const result = await RecipesApi.createNewCommunity(community, token);
            if (result.error) {
                setFormErrors([...result.error]);
            } else if (result.community) {
                const createdCommunity = result.community;
                setPublicCommunities((communities) => [createdCommunity, ...communities]);
                setUserCommunities((communities) => [createdCommunity, ...communities]);

                // clear errors, provide success message, navigate back
                setFormErrors([]);
                setClientMessage({ color: 'success', message: 'Community created!' });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong while creating the community.');
            }
        } catch (err) {
            console.error('Error creating community:', err);
        }
    }

    /**
     * Gets a community by its ID.
     * @param {*} id the ID of the community
     * @returns the community object
     */
    const getCommunityById = useCallback(async (id) => {
        try {
            const result = await RecipesApi.getCommunityById(+id, token);
            return result;
        } catch (err) {
            console.log('Error getting community:', err);
            throw err;
        }
    }, [token]);

    /**
     * Gets all communities created by a user.
     * @param {*} userId the ID of the user
     * @returns list of communities
     */
    const getCommunitiesByUserId = async (userId) => {
        try {
            const result = await RecipesApi.getCommunitiesByUserId(+userId, token);
            if (result) return result;
            else return [];
        } catch (err) {
            console.log('Error getting communities by user ID:', err);
            return [];
        }
    };

    /**
     * Update a community
     * @param {*} community the community to update 
     * @returns navigates to previous page
     */
    const updateCommunity = async (community) => {
        try {
            const result = await RecipesApi.updateCommunity(community, token);
            if (result.error) {
                setFormErrors([...result.error]);
            } else if (result.community) {
                const updatedCommunity = result.community;
                setPublicCommunities((communities) => communities.map(c => c.id === updatedCommunity.id ? updatedCommunity : c));

                // clear errors, provide success message, navigate back
                setFormErrors([]);
                setClientMessage({ color: 'success', message: 'Community updated!' });
                return navigate(-1);
            } else {
                throw new Error('Something went wrong while updating the community.');
            }
        } catch (err) {
            console.error('Error updating community:', err);
        }
    }

    /**
     * Deletes a community
     * @param {*} id the community ID
     */
    const deleteCommunity = async (id) => {
        try {
            const result = await RecipesApi.deleteCommunity(id, token);
            if (result.success) {
                setPublicCommunities((communities) => communities.filter(c => c.id !== id));
                setClientMessage({ color: 'success', message: 'Community deleted.' });
            } else {
                throw new Error('Something went wrong while deleting the community.');
            }
        } catch (err) {
            console.error('Error deleting community:', err);
        }
    }

    return (
        <CommunitiesContext.Provider value={{
            publicCommunities,
            userCommunities,
            loading,
            formErrors,
            addCommunity,
            getCommunityById,
            updateCommunity,
            deleteCommunity
        }}>
            {children}
        </CommunitiesContext.Provider>
    );
}

export default CommunitiesProvider;