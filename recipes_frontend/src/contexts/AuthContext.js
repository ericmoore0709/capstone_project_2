import { createContext } from "react";

export const AuthContext = createContext({
    signedInUser: JSON.parse(localStorage.getItem('signedInUser')) || null,
    token: localStorage.getItem('token') || ''
});
