import { Navigate } from 'react-router-dom';
import { useAuth, type AuthContextType, type AuthProviderProps } from '../context/AuthContext';

export default function PrivateRoute({ children }: AuthProviderProps){
    const authContext: AuthContextType | null = useAuth();
    if (authContext && authContext.loading){
        return(
            <div className="alert alert-info text-center" role="alert">
                Cargando, por favor espere...
            </div>
        );
    } else{
        return authContext && authContext.user ? children : <Navigate to="/login" />
    }
}