import { createContext } from "react";

export const AuthContext = createContext(JSON.parse(localStorage.getItem('signedInUser')) || null);