import { useEffect, useState } from "react";
import RecipesApi from "../../api";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [signedInUser, setSignedInUser] = useState(null);
    const [token, setToken] = useState((localStorage.getItem('token') || null));

    const navigate = useNavigate();

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
  * Logs out the user
  */
    const logoutUser = () => {
        setSignedInUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    return { signedInUser, token, logoutUser };
}

export default useAuth;