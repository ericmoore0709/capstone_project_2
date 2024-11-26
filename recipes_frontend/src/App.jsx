import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import RecipeList from './components/recipes/RecipeList';
import NewRecipeForm from './components/recipes/NewRecipeForm';
import { useCallback, useEffect, useState } from 'react';
import RecipesApi from '../api';
import RecipeDetails from './components/recipes/RecipeDetails';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import UpdateRecipeForm from './components/recipes/UpdateRecipeForm';
import ShelfList from './components/shelves/ShelfList';
import NewShelfForm from './components/shelves/NewShelfForm';
import UpdateShelfForm from './components/shelves/UpdateShelfForm';
import Profile from './components/profiles/Profile';

function App() {
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [recipeFormErrors, setRecipeFormErrors] = useState([]);

  const [userShelves, setUserShelves] = useState([]);
  const [shelfFormErrors, setShelfFormErrors] = useState([]);

  const [signedInUser, setSignedInUser] = useState(null);
  const [token, setToken] = useState((localStorage.getItem('token') || null));
  const [clientMessage, setClientMessage] = useState({ color: 'info', message: '' });
  const navigate = useNavigate();

  /**
   * Fetch public recipes, set publicRecipes state
   */
  const fetchPublicRecipes = async () => {
    try {
      const apiRecipes = await RecipesApi.getAllPublicRecipes();
      setPublicRecipes(apiRecipes);
    } catch (error) {
      console.error("Error fetching public recipes:", error);
    }
  };

  /**
   * Fetch user recipes, set userRecipes state
   */
  const fetchUserRecipes = useCallback(async () => {
    try {
      const apiRecipes = await RecipesApi.getUserRecipes(signedInUser.id, token);
      setUserRecipes(apiRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  }, [signedInUser?.id, token]);

  /**
   * Fetch user shelves, set user shelves state
   */
  const fetchUserShelves = useCallback(async () => {
    try {
      const apiShelves = await RecipesApi.getUserShelves(signedInUser.id, token);
      setUserShelves(apiShelves);
    } catch (err) {
      console.error('Error fetching user shelves:', err);
    }
  }, [signedInUser?.id, token]);

  /**
   * Get recipes and shelves upon login
   */
  useEffect(() => {
    fetchPublicRecipes();
    if (signedInUser?.id && token) {
      fetchUserRecipes();
      fetchUserShelves();
    }
  }, [fetchUserShelves, fetchUserRecipes, signedInUser?.id, token]);

  // get token from request useEffect
  useEffect(() => {
    // Check for token in URL or localStorage, then set it
    const getTokenFromRequest = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const newToken = urlParams.get('token');

        if (newToken) {
          const decoded = JSON.parse(atob(newToken.split('.')[1]));
          setSignedInUser(decoded);
          setToken(newToken);
          localStorage.setItem('token', newToken);

          // create user profile
          await RecipesApi.createProfile(decoded.id);

          return navigate('/');
        } else if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setSignedInUser(decoded);
        }
      } catch (err) {
        console.log("Error processing token:", err);
      }
    };
    getTokenFromRequest();
  }, [token, navigate]);

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
   * Returns a list of (shelfId, shelfLabel) KV pairs
   * @returns a list of (shelfId, shelfLabel) KV pairs
   */
  const getShelfOptions = () => {
    const shelfOptions = userShelves.map((shelf) => {
      return { id: shelf.id, label: shelf.label };
    });
    return shelfOptions;
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

  /**
   * Logs out the user
   */
  const logoutUser = () => {
    setSignedInUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  /**
   * Closes the client message alert
   */
  const clientMessageXClicked = () => {
    setClientMessage({ color: 'info', message: '' });
  }

  /**
   * Encapsulates route and redirects unauthed user to landing page
   * @param {*} param0 
   * @returns 
   */
  const ProtectedRoute = ({ element }) => {
    return signedInUser ? element : <h1>Landing Page</h1>
  };

  ProtectedRoute.propTypes = {
    element: PropTypes.object.isRequired
  };

  return (
    <>
      <SiteNavbar signedInUser={signedInUser} logoutUser={logoutUser} />
      {clientMessage.message && (
        <Alert color={clientMessage.color} isOpen={(clientMessage.message !== "")} toggle={clientMessageXClicked}>{clientMessage.message}</Alert>
      )}
      <Routes>
        {signedInUser ? (
          <>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/recipes' element={<ProtectedRoute
              element={<RecipeList title='Public Recipes' recipes={publicRecipes} signedInUser={signedInUser} deleteRecipe={deleteRecipe} shelfOptions={getShelfOptions()} addRecipeToShelf={addRecipeToShelf} />} />} />
            <Route path='/recipes/:id' element={<ProtectedRoute
              element={<RecipeDetails />} />} />
            <Route
              path='/recipes/new'
              element={
                <ProtectedRoute
                  element={<NewRecipeForm addRecipe={addRecipe} signedInUser={signedInUser} errors={recipeFormErrors} />}
                />
              }
            />
            <Route path='/recipes/my' element={<ProtectedRoute
              element={<RecipeList title='My Recipes' recipes={userRecipes} signedInUser={signedInUser} deleteRecipe={deleteRecipe} />} />} />
            <Route path='/recipes/:id/edit' element={<ProtectedRoute
              element={<UpdateRecipeForm updateRecipe={updateRecipe} signedInUser={signedInUser} errors={recipeFormErrors} />} />} />

            {/* Shelf routes */}
            <Route path='/shelves' element={<ProtectedRoute
              element={<ShelfList shelves={userShelves} updateShelf={updateShelf} signedInUser={signedInUser} errors={shelfFormErrors} deleteShelf={deleteShelf} removeRecipeFromShelf={removeRecipeFromShelf} />} />} />
            <Route path='/shelves/new' element={
              <ProtectedRoute
                element={<NewShelfForm addShelf={addShelf} signedInUser={signedInUser} errors={shelfFormErrors} />}
              />
            } />
            <Route path='/shelves/:id/edit' element={
              <ProtectedRoute
                element={<UpdateShelfForm updateShelf={updateShelf} signedInUser={signedInUser} errors={shelfFormErrors} />}
              />
            } />
            <Route path='/profiles/my' element={
              <ProtectedRoute
                element={<Profile signedInUser={signedInUser} />}
              />}
            />
            <Route path='/profiles/:id' element={
              <ProtectedRoute
                element={<Profile signedInUser={signedInUser} />}
              />}
            />
          </>
        ) : (
          <>
            <Route path='/' element={<h1>Landing Page</h1>} />
          </>
        )}
      </Routes>
      <div className='text-center' style={{ width: '100%', position: 'sticky', bottom: 5 }}><footer>&copy; Eric Moore 2024</footer></div>
    </>
  );
}

export default App;
