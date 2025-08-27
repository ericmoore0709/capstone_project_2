import { useCallback, useEffect, useState } from "react";
import CommunitiesContext from "../contexts/CommunitiesContext";
import RecipesApi from "../../api";
import useNotification from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CommunitiesProvider = ({ children }) => {
    const { token } = useAuth();
    const { setClientMessage } = useNotification();
    const navigate = useNavigate();

    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    /**
     * Fetches a list of communities from the server.
     */
    const fetchCommunities = useCallback(async () => {
        setLoading(true);
        try {
            const communities = await RecipesApi.getCommunities(token);
            setCommunities(communities);
        } catch (err) {
            console.error('Error fetching communities:', err);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        fetchCommunities();
    }, [fetchCommunities]);

    /**
     * Adds a community to the website.
     * @param {*} community the commnity to add
     * @returns navigates to previous page
     */
    const addCommunity = async (community) => {
        try {
            const result = await RecipesApi.createNewCommunity(community, token);
            if (result.error) {
                setFormErrors(result.error);
            } else if (result.community) {
                const createdCommunity = result.community;
                setCommunities((communities) => [createdCommunity, ...communities]);

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
    const getCommunitiesByUserId = useCallback(async (userId) => {
        try {
            const result = await RecipesApi.getCommunitiesByUserId(+userId, token);
            return result;
        } catch (err) {
            console.log('Error getting communities by user ID:', err);
            throw err;
        }
    }, [token]);

    /**
     * Update a community
     * @param {*} community the community to update 
     * @returns navigates to previous page
     */
    const updateCommunity = async (community) => {
        try {
            const result = await RecipesApi.updateCommunity(community, token);
            if (result.error) {
                setFormErrors(result.error);
            } else if (result.community) {
                const updatedCommunity = result.community;
                setCommunities((communities) => communities.map(c => c.id === updatedCommunity.id ? updatedCommunity : c));

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
                setCommunities((communities) => communities.filter(c => c.id !== id));
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
            communities,
            loading,
            formErrors,
            addCommunity,
            getCommunityById,
            getCommunitiesByUserId,
            updateCommunity,
            deleteCommunity
        }}>
            {children}
        </CommunitiesContext.Provider>
    );
}

export default CommunitiesProvider;