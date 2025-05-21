import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';


const PrivateRoutes = () => {

    const { token, setToken} = useAuth(); // Obtiene el token del contexto de autenticación

    if (token) {
        try {
           const decodedToken = jwtDecode(token);
            if(decodedToken.exp * 1000 < Date.now()){
                sessionStorage.removeItem("authToken");
                setToken(null);
                return <Navigate to="/" />;
            }
            return <Outlet />;
        } catch (error) {
            sessionStorage.removeItem("authToken");
            setToken(null);
            return <Navigate to="/" />;
        }
    } else {
        return <Navigate to="/" />;
    }

}

export default PrivateRoutes;