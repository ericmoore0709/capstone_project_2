import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import { useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import useRecipes from './hooks/useRecipes';
import useShelves from './hooks/useShelves';
import useAuth from './hooks/useAuth';
import routes from './config/RoutesConfig';

function App() {
  const [clientMessage, setClientMessage] = useState({ color: 'info', message: '' });

  const { signedInUser, getTokenFromRequest, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setSessionToken = async () => {
      if (!signedInUser) {
        await getTokenFromRequest();
        navigate('/');
      }
    }
    setSessionToken();
  }, [getTokenFromRequest, navigate, signedInUser]);

  const {
    publicRecipes,
    userRecipes,
    recipeFormErrors,
    addRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe
  } = useRecipes(setClientMessage);

  const {
    userShelves,
    shelfFormErrors,
    addShelf,
    getShelf,
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

  const handlers = {
    signedInUser,
    publicRecipes,
    userRecipes,
    recipeFormErrors,
    addRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    userShelves,
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
      <SiteNavbar signedInUser={signedInUser} logoutUser={logoutUser} />
      {clientMessage.message && (
        <Alert
          color={clientMessage.color}
          isOpen={(clientMessage.message !== "")}
          toggle={clientMessageXClicked}>
          {clientMessage.message}
        </Alert>
      )}

      <Routes>
        {routes(signedInUser, handlers).map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>

      <div className='text-center' style={{ width: '100%', position: 'sticky', bottom: 5 }}><footer>&copy; Eric Moore 2024</footer></div>
    </>
  );
}

export default App;
