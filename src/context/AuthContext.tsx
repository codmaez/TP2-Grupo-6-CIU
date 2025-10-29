import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export const AuthContext = createContext<AuthContextType | null>(null);

interface User {
    id: number;
    nickName: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUser: string | null = localStorage.getItem('user');
        if(storedUser){
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        setLoading(false);
    }, [])

    const login = async (username: string, password: string): Promise<void> => {
        try{
            const res = await fetch('http://localhost:3001/users');
            const users: User[] = await res.json();
            const userAccount: User | undefined = users.find(user => user.nickName === username)
            if (!userAccount){
                alert('El usuario no existe');
            } else if (password === '1234'){
                setUser(userAccount);
                localStorage.setItem('user', JSON.stringify(userAccount));
            } else{
                alert('Contraseña incorrecta');
            }
        } catch(err: unknown){
            if (err instanceof Error){
                alert(`Ocurrio un error: ${err.message}`);
            } else{
                alert('Error desconocido')
            }
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}