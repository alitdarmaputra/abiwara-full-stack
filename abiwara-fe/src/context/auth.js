import { useContext, createContext } from "react";
import { useLocalStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useLocalStorage("auth_token", "");
    return (
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
