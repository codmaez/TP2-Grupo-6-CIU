import { useAuth, type AuthContextType } from "../context/AuthContext";
import { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import Post, { type PostType } from '../components/Post'; 
import './css/ProfilePage.css'; 

const DEFAULT_AVATAR = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg";

export default function Profile() {
    const auth: AuthContextType | null = useAuth();
    //los posteos, la carga y el error
    const [posteos, setPosteos] = useState<PostType[]>([]); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = auth?.user?.id;
    
  // Carga de datos
    useEffect(() => {
        if (!userId) return; 
        if (auth?.loading) return; // Espera a que el auth esté listo

        const cargarDatosDelFeed = async () => {
            setCargando(true);
            setError(null);
            
            try {
                const resPosteos = await fetch(`http://localhost:3001/posts?userId=${userId}`);
                if (!resPosteos.ok) throw new Error('No se pudieron cargar los posteos');
                const posteosDelUsuario: PostType[] = await resPosteos.json();
                setPosteos(posteosDelUsuario);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Ocurrió un error desconocido");
            } finally {
                setCargando(false);
            }
        };
        cargarDatosDelFeed();
    }, [userId, auth?.loading]);


    // Errores

    if (!auth) {
        return <div className="p-5 text-center">Auth no disponible.</div>;
    }
    if (auth.loading || cargando) {
        return (
            <div className="profileLayout">
                <NavBar />
                <main className="profileFeed">
                    <div className="p-5 text-center">Cargando...</div>
                </main>
            </div>
        );
    }
    if (error) {
        return <div className="alert alert-danger p-5 text-center">Error: {error}</div>;
    }
    if (!auth.user) {  // Esto es para evitar que salga el error de auth.user puede ser null
        return (
            <div className="profileLayout">
                <NavBar />
                <main className="profileFeed">
                    <div className="p-5 text-center">No se pudo cargar el perfil del usuario.</div>
                </main>
            </div>
        );
    }
 

    

    return (
        <div className="profileLayout">
            
            <NavBar />
            
            <main className="profileFeed">

                <header className="profileHeader">
                    <img 
                        src={DEFAULT_AVATAR} 
                        alt="Avatar" 
                        className="profileAvatar"
                    />
                    <div className="profileInfo">
                        <h1 className="profileNickName">{auth.user.nickName}</h1>
                        <p className="profileEmail">{auth.user.email}</p>
                        <p className="profileMeta">
                            Se unió el: {new Date(auth.user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </header>

                <div className="profileFilters">
                    <button className="filterActive">
                        Publicaciones
                    </button>
                </div>

                <div className="postList">
                    {posteos.length === 0 ? (
                        <p className="p-4">No hay publicaciones para mostrar.</p>
                    ) : (
                        posteos.map(posteo => (
                            <Post key={posteo.id} post={posteo} />
                        ))
                    )}
                </div>
            </main>
            
        </div>
    )
}