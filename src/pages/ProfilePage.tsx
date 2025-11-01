import { useAuth, type AuthContextType } from "../context/AuthContext";
import { useState, useEffect } from 'react';


import NavBar from '../components/navBar';

import Post, { type PostType } from '../components/Post';


import './css/ProfilePage.css'; 

type UserProfile = {
    id: number;
    nickName: string;
    email: string;
    createdAt: string; 
    avatarUrl?: string; 
};


const avatarPerfil = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg";



export default function Profile() {

    const auth: AuthContextType | null = useAuth();
    const [perfil, setPerfil] = useState<UserProfile | null>(null);

    const [posteos, setPosteos] = useState<PostType[]>([]); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = auth?.user?.id;


    useEffect(() => {
        if (!userId) return; 

        const cargarDatosDelPerfil = async () => {
            setCargando(true);
            setError(null);
            
            try {

                const [resPerfil, resPosteos] = await Promise.all([
                    fetch(`http://localhost:3001/users/${userId}`),
                    fetch(`http://localhost:3001/posts?userId=${userId}`) 
                ]);
                if (!resPerfil.ok) throw new Error('No se pudo cargar el perfil del usuario');
                if (!resPosteos.ok) throw new Error('No se pudieron cargar los posteos');
                
                const perfilData: UserProfile = await resPerfil.json();
                const posteosDelUsuario: PostType[] = await resPosteos.json();


                setPerfil({
                    ...perfilData,
                    avatarUrl: avatarPerfil
                });

                setPosteos(posteosDelUsuario);

            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Ocurrió un error desconocido");
            } finally {
                setCargando(false);
            }
        };
        
        cargarDatosDelPerfil();
        
    }, [userId]); 

    if (cargando) {
        return <div className="p-5 text-center">Cargando perfil...</div>;
    }
    if (error) {
        return <div className="alert alert-danger p-5 text-center">Error: {error}</div>;
    }
    if (!perfil) {
        return <div className="p-5 text-center">No se pudo cargar el perfil.</div>;
    }


    return (
        <div className="profileLayout">
            

            <NavBar />

            <main className="profileFeed">
                

                <header className="profileHeader">
                    <img 
                        src={perfil.avatarUrl} 
                        alt="Avatar" 
                        className="profileAvatar"
                    />
                    <div className="profileInfo">
                        <h1 className="profileNickName">{perfil.nickName}</h1>
                        <p className="profileEmail">{perfil.email}</p>
                        <p className="profileMeta">
                            Se unió el: {new Date(perfil.createdAt).toLocaleDateString()}
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