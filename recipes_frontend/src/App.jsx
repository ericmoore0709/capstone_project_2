import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import { useEffect } from 'react';
import useRecipes from './hooks/useRecipes';
import useShelves from './hooks/useShelves';
import useAuth from './hooks/useAuth';
import routes from './config/RoutesConfig';
import ClientNotification from './components/util/ClientNotification';

function App() {
  const { signedInUser, getTokenFromRequest, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setSessionToken = async () => {
      if (!signedInUser) {
        getTokenFromRequest();
        navigate('/');
      }
    }
    setSessionToken();
  }, [getTokenFromRequest, navigate, signedInUser]);

  const {
    publicRecipes,
    userRecipes,
    publicLoading,
    userLoading,
    recipeFormErrors,
    addRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe
  } = useRecipes();

  const {
    userShelves,
    loading: shelvesLoading,
    shelfFormErrors,
    addShelf,
    getShelf,
    updateShelf,
    deleteShelf,
    addRecipeToShelf,
    removeRecipeFromShelf
  } = useShelves();

  /**
   * Returns a list of (shelfId, shelfLabel) KV pairs
   * @returns a list of (shelfId, shelfLabel) KV pairs
   */
  const getShelfOptions = () => {
    const shelfOptions = userShelves?.map((shelf) => {
      return { id: shelf.id, label: shelf.label };
    });
    return shelfOptions;
  }

  const handlers = {
    signedInUser,
    publicRecipes,
    userRecipes,
    publicLoading,
    userLoading,
    recipeFormErrors,
    addRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    userShelves,
    shelvesLoading,
    shelfFormErrors,
    addShelf,
    getShelf,
    updateShelf,
    deleteShelf,
    getShelfOptions,
    addRecipeToShelf,
    removeRecipeFromShelf
  };

  return (
    <>
      <SiteNavbar logoutUser={logoutUser} />
      <ClientNotification />

      <Routes>
        {routes(handlers).map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>

      <div className='text-center' style={{ width: '100%', position: 'sticky', bottom: 5 }}><footer>&copy; Eric Moore 2024</footer></div>
    </>
  );
}

export default App;
