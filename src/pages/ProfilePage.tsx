import { useAuth, type AuthContextType } from "../context/AuthContext"

export default function Profile() {
    const auth: AuthContextType | null = useAuth();

    return(
        <>
            <p>Pagina de perfil de usuario: {auth?.user?.username}</p>
            <button onClick={auth?.logout}>Cerrar sesión</button>
        </>
    )
}