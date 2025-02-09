import axios from 'axios';

const BASE_URI = import.meta.env.VITE_BACKEND_URI;
export const api = axios.create({ baseURL: BASE_URI });

class RecipesApi {

    /** Helper function to create a request with consistent error handling and optional token. */
    static _create_request = async (endpoint = '', method = 'get', data = null, token = null) => {
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        try {
            const response = await api.request({
                url: endpoint,
                method: method,
                data: data,
                headers: headers,
            });
            return response.data;
        } catch (err) {
            if (err.status >= 400 && err.status < 500) {
                return err.response.data;
            } else {
                console.error("API Error:", err);
                throw new Error(err.response ? err.response.data.error : err.message);
            }
        }
    }

    /** Get all public recipes */
    static getAllPublicRecipes = async (token) => {
        const response = await this._create_request('/recipes', 'get', null, token);
        return response.recipes;
    }

    /** Get a specific recipe by its ID */
    static getRecipeById = async (id, token) => {
        const response = await this._create_request(`/recipes/${id}`, 'get', null, token);
        return response.recipe;
    }

    /** Create a new recipe (requires token for authentication) */
    static createNewRecipe = async (recipe, token) => {
        const response = await this._create_request('/recipes', 'post', recipe, token);
        return response;
    }

    /** Get all recipes by a specific user (requires token for authentication) */
    static getUserRecipes = async (userId, token) => {
        const response = await this._create_request(`/recipes/user/${userId}`, 'get', null, token);
        return response.recipes;
    }

    /** Get all public recipes by a specific user */
    static getUserPublicRecipes = async (userId, token) => {
        const response = await this._create_request(`/recipes/user/${userId}/public`, 'get', null, token);
        return response;
    }

    /** Update a recipe given new data */
    static updateRecipe = async (recipe, token) => {
        const { id, ...theRest } = recipe;
        const response = await this._create_request(`/recipes/${id}`, 'patch', theRest, token);
        return response;
    }

    /** Delete the recipe at the given ID */
    static deleteRecipe = async (id, token) => {
        const response = await this._create_request(`/recipes/${id}`, 'delete', null, token);
        return response;
    }


    /**  Shelf Routes  */

    /** Create a new shelf (requires token for authentication) */
    static createNewShelf = async (shelf, token) => {
        const response = await this._create_request('/shelves', 'post', shelf, token);
        return response;
    }

    static getShelfById = async (id, token) => {
        const response = await this._create_request(`/shelves/${id}`, 'get', null, token);
        return response;
    }

    /** Get all shelves by a specific user (requires token for authentication) */
    static getUserShelves = async (userId, token) => {
        const response = await this._create_request(`/shelves/users/${userId}`, 'get', null, token);
        return response.shelves;
    }

    /** Update a shelf given new data */
    static updateShelf = async (shelf, token) => {
        const { id, ...theRest } = shelf;
        const response = await this._create_request(`/shelves/${id}`, 'patch', theRest, token);
        return response;
    }

    /** Delete the shelf at the given ID */
    static deleteShelf = async (id, token) => {
        const response = await this._create_request(`/shelves/${id}`, 'delete', null, token);
        return response;
    }

    /** Add the given recipe to the given shelf */
    static addShelfRecipe = async (shelfId, recipeId, token) => {
        const response = await this._create_request(`/shelves/${shelfId}/recipes`, 'post', { recipe_id: recipeId }, token);
        return response;
    }

    /** Remove the given recipe from the given shelf */
    static removeShelfRecipe = async (shelfId, recipeId, token) => {
        const response = await this._create_request(`/shelves/${shelfId}/recipes/${recipeId}`, 'delete', null, token);
        return response;
    }

    /** Create the user profile */
    static createProfile = async (userId, token) => {
        const response = await this._create_request('/profiles/', 'post', { user_id: userId }, token);
        return response;
    }

    /** Get the user profile */
    static getProfile = async (userId, token) => {
        const response = await this._create_request(`/profiles/${userId}`, 'get', null, token);
        return response;
    }

    static updateProfile = async (profile, token) => {
        const response = await this._create_request(`/profiles/${profile.userId}`, 'patch', { bio: profile.bio }, token);
        return response;
    }
}

export default RecipesApi;
