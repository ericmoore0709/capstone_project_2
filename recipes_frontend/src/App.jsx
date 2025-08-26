import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SiteNavbar from './components/nav/SiteNavbar';
import { useEffect } from 'react';
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

  return (
    <>
      <SiteNavbar logoutUser={logoutUser} />
      <ClientNotification />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <div className='text-center' style={{ width: '100%', position: 'sticky', bottom: 5 }}><footer>&copy; Eric Moore 2024</footer></div>
    </>
  );
}

export default App;
