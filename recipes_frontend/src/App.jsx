import { Route, Routes } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import RecipeList from './components/recipes/RecipeList';
import NewRecipeForm from './components/recipes/NewRecipeForm';
import { useState } from 'react';
import RecipeDetails from './components/recipes/RecipeDetails';
import { Alert } from 'reactstrap';
import UpdateRecipeForm from './components/recipes/UpdateRecipeForm';
import ShelfList from './components/shelves/ShelfList';
import NewShelfForm from './components/shelves/NewShelfForm';
import UpdateShelfForm from './components/shelves/UpdateShelfForm';
import Profile from './components/profiles/Profile';
import useRecipes from './hooks/useRecipes';
import useShelves from './hooks/useShelves';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/nav/ProtectedRoute';

function App() {
  const [clientMessage, setClientMessage] = useState({ color: 'info', message: '' });

  const { signedInUser, logoutUser } = useAuth();

  const {
    publicRecipes,
    userRecipes,
    recipeFormErrors,
    addRecipe,
    updateRecipe,
    deleteRecipe
  } = useRecipes(setClientMessage);

  const {
    userShelves,
    shelfFormErrors,
    addShelf,
    updateShelf,
    deleteShelf,
    addRecipeToShelf,
    removeRecipeFromShelf
  } = useShelves(setClientMessage);

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
   * Closes the client message alert
   */
  const clientMessageXClicked = () => {
    setClientMessage({ color: 'info', message: '' });
  }

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
