import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

export const RouteGuard = ({ children }) => {
    const location = useLocation();
    const auth = useAuth();

    if (!auth.authToken) {
        return <Navigate to='/login' state={{ path: location.pathname }} />
    }

    return (
		children
    )
}
