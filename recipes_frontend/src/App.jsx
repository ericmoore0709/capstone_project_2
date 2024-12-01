import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import RecipeList from './components/recipes/RecipeList';
import NewRecipeForm from './components/recipes/NewRecipeForm';
import { useEffect, useState } from 'react';
import RecipesApi from '../api';
import RecipeDetails from './components/recipes/RecipeDetails';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import UpdateRecipeForm from './components/recipes/UpdateRecipeForm';
import ShelfList from './components/shelves/ShelfList';
import NewShelfForm from './components/shelves/NewShelfForm';
import UpdateShelfForm from './components/shelves/UpdateShelfForm';
import Profile from './components/profiles/Profile';
import useRecipes from './hooks/useRecipes';
import useShelves from './hooks/useShelves';

function App() {
  const [signedInUser, setSignedInUser] = useState(null);
  const [token, setToken] = useState((localStorage.getItem('token') || null));
  const [clientMessage, setClientMessage] = useState({ color: 'info', message: '' });
  const navigate = useNavigate();

  const {
    publicRecipes,
    userRecipes,
    recipeFormErrors,
    addRecipe,
    updateRecipe,
    deleteRecipe
  } = useRecipes(signedInUser, token, setClientMessage, navigate);

  const {
    userShelves,
    shelfFormErrors,
    addShelf,
    updateShelf,
    deleteShelf,
    addRecipeToShelf,
    removeRecipeFromShelf
  } = useShelves(signedInUser, token, setClientMessage, navigate);

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
