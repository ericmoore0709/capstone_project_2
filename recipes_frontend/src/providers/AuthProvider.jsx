import { useCallback, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RecipesApi from "../../api";

const AuthProvider = ({ children }) => {
    const [signedInUser, setSignedInUser] = useState(JSON.parse(localStorage.getItem('signedInUser')) || null);
    const [token, setToken] = useState((localStorage.getItem('token') || null));

    const navigate = useNavigate();

    // get token from request
    const getTokenFromRequest = useCallback(async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const newToken = urlParams.get('token');

            if (newToken) {
                const decoded = JSON.parse(atob(newToken.split('.')[1]));
                setSignedInUser(decoded);
                setToken(newToken);
                localStorage.setItem('token', newToken);
                localStorage.setItem('signedInUser', JSON.stringify(decoded));

                // create user profile
                const existingProfile = await RecipesApi.getProfile(decoded.id, newToken);
                if (!existingProfile.profile)
                    await RecipesApi.createProfile(decoded.id, newToken);
            }
        } catch (err) {
            console.log("Error processing token:", err);
        }
    }, []);

    /**
  * Logs out the user
  */
    const logoutUser = () => {
        setSignedInUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('signedInUser');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ signedInUser, token, getTokenFromRequest, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
