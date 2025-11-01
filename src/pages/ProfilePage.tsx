import { useAuth, type AuthContextType } from "../context/AuthContext";
import { useState, useEffect, useMemo } from 'react';

import NavBar from '../components/navBar';


import './css/ProfilePage.css'; 


type UserProfile = {
    id: number;
    nickName: string;
    email: string;
    createdAt: string; 
    avatarUrl?: string; 
};
type Post = {
    id: number;
    description: string;
    UserId: number;
};
type PostImage = {
    id: number;
    url: string;
    PostId: number;
};
type Comment = {
    id: number;
    content: string;
    UserId: number;
    PostId: number;
    User?: { 
        nickName: string;
    };
};
// Este tipo combina datos de Post, PostImage y Comments
type PosteoMostrable = {
    id: number;
    description: string;
    UserId: number;
    tieneFoto: boolean;
    imagenUrl?: string; 
    comments: Comment[]; 
};

const avatarDefault = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg";



export default function Profile() {
    

    // Contexto de Autenticación (para saber quién es el usuario)
    const auth: AuthContextType | null = useAuth();
    
    // Estados para los datos traídos del Backend
    const [perfil, setPerfil] = useState<UserProfile | null>(null);
    const [posteos, setPosteos] = useState<Post[]>([]);
    const [imagenes, setImagenes] = useState<PostImage[]>([]);
    const [comentarios, setComentarios] = useState<Comment[]>([]); 
    
    // Estados para la UI 
    const [filtro, setFiltro] = useState<'todos' | 'fotos'>('todos');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de Interacción (Likes, Destacados, Comentarios, etc.)
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set()); 
    const [highlightedPosts, setHighlightedPosts] = useState<Set<number>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PosteoMostrable | null>(null);
    const [newCommentText, setNewCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isModalClosing, setIsModalClosing] = useState(false); // Para animación

    // Obtenemos el ID del usuario logueado desde el contexto
    const userId = auth?.user?.id;


    useEffect(() => {
        // No hacer nada si no sabemos quién es el usuario
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
                const posteosDelUsuario: Post[] = await resPosteos.json();


                // Perfil
                setPerfil({
                    ...perfilData,
                    avatarUrl: avatarDefault
                });

                setPosteos(posteosDelUsuario);


                if (posteosDelUsuario.length > 0) {
                    

                    const promesasDeImagenes = posteosDelUsuario.map(post =>
                        fetch(`http://localhost:3001/postimages/post/${post.id}`)
                    );

                    const respuestasImagenes = await Promise.all(promesasDeImagenes);

                    const arraysDeImagenes = await Promise.all(
                        respuestasImagenes.map(res => res.ok ? res.json() : [])
                    );
 
                    setImagenes(arraysDeImagenes.flat()); 


                    const promesasDeComentarios = posteosDelUsuario.map(post =>
                        fetch(`http://localhost:3001/comments/post/${post.id}`)
                    );
                    const respuestasComentarios = await Promise.all(promesasDeComentarios);
                    const arraysDeComentarios = await Promise.all(
                        respuestasComentarios.map(res => res.ok ? res.json() : [])
                    );
                    setComentarios(arraysDeComentarios.flat());
                } else {
                    // Si no hay posteos, asegura que las imágenes/comentarios estén vacíos
                    setImagenes([]);
                    setComentarios([]);
                }
            } catch (err) {
                // Manejo de cualquier error que haya ocurrido en el 'try'
                if (err instanceof Error) setError(err.message);
                else setError("Ocurrió un error desconocido");
            } finally {
                // Se ejecuta siempre, haya error o no
                setCargando(false);
            }
        };
        
        cargarDatosDelPerfil();
        
    }, [userId]); 



    const posteosMostrables = useMemo(() => {
   
        // Esto es  más rápido que usar .find() dentro de un .map()
        const mapaImagenes = new Map<number, string>();
        for (const img of imagenes) {
            if (!mapaImagenes.has(img.PostId)) {
                mapaImagenes.set(img.PostId, img.url);
            }
        }
        
        const mapaComentarios = new Map<number, Comment[]>();
        for (const comment of comentarios) {
            const listaActual = mapaComentarios.get(comment.PostId) || [];
            listaActual.push(comment);
            mapaComentarios.set(comment.PostId, listaActual);
        }

        // Combina todo en un array de objetos "listos para mostrar"
        const posteosCombinados: PosteoMostrable[] = posteos.map(post => {
            const imagenUrl = mapaImagenes.get(post.id);
            return {
                ...post,
                tieneFoto: !!imagenUrl,
                imagenUrl: imagenUrl,
                comments: mapaComentarios.get(post.id) || []
            };
        });
        
        // El 'return' de useMemo es el valor que se memoriza
        return posteosCombinados;

    }, [posteos, imagenes, comentarios]);

  
    const posteosFiltrados = useMemo(() => {
        if (filtro === 'fotos') {
            return posteosMostrables.filter(post => post.tieneFoto);
        }
        return posteosMostrables; // Si el filtro es 'todos'
    }, [posteosMostrables, filtro]); 



    
    // Maneja el clic en "Like"
    const toggleLike = (postId: number) => {
        // Actualiza el estado (Set) de 'likedPosts'
        setLikedPosts(prevLikedPosts => {
            const newLikedPosts = new Set(prevLikedPosts);
            if (newLikedPosts.has(postId)) newLikedPosts.delete(postId);
            else newLikedPosts.add(postId);
            return newLikedPosts;
        });
    };

    // Maneja el clic en "Destacar"
    const toggleHighlight = (postId: number) => {
        setHighlightedPosts(prevHighlighted => {
            const newHighlighted = new Set(prevHighlighted);
            if (newHighlighted.has(postId)) newHighlighted.delete(postId);
            else newHighlighted.add(postId);
            return newHighlighted;
        });
    };

    // Abre el modal de "Ver más"
    const handleOpenModal = (post: PosteoMostrable) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        setIsModalClosing(false); // Resetea la animación de cierre
    };

    // Cierra el modal (con animación)
    const handleCloseModal = () => {
        setIsModalClosing(true); // Activa la animación de salida
    
        // 2. Espera 300ms a que termine la animación
        setTimeout(() => {
            // 3. Quita el modal y resetea los estados
            setIsModalOpen(false);
            setIsModalClosing(false); 
            setSelectedPost(null);
            setNewCommentText(""); 
            setIsSubmitting(false); 
        }, 300); 
    };
    
    // Envía un nuevo comentario al backend
    const handlePostComment = async () => {
        // Comprobaciones antes de enviar
        if (!auth?.user?.id || !selectedPost || !newCommentText.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }
        setIsSubmitting(true);
        
        const commentData = {
            content: newCommentText,
            userId: auth.user.id,
            postId: selectedPost.id
        };

        try {

            const res = await fetch('http://localhost:3001/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (!res.ok) throw new Error("Error al publicar el comentario");
            
            const newlySavedComment = await res.json();
            

            const commentWithUser: Comment = {
                ...newlySavedComment,
                User: { nickName: auth.user.nickName } 
            };
            

            setComentarios(prevComentarios => [...prevComentarios, commentWithUser]);
            setSelectedPost(prevSelected => 
                prevSelected ? {
                    ...prevSelected,
                    comments: [...prevSelected.comments, commentWithUser]
                } : null
            );
            setNewCommentText(""); // Limpia el input

        } catch (err) {
            console.error(err);
            alert("No se pudo publicar el comentario.");
        } finally {
            setIsSubmitting(false); // Reactiva el botón
        }
    };


    // Vistas de Carga y Error
    if (cargando) {
        return <div className="p-5 text-center">Cargando perfil...</div>;
    }
    if (error) {
        return <div className="alert alert-danger p-5 text-center">Error: {error}</div>;
    }
    if (!perfil) {
        return <div className="p-5 text-center">No se pudo cargar el perfil.</div>;
    }

    //Vista Principal 
    return (
        <div className="profileLayout">
            

            <NavBar />
            

            <main className="profileFeed">
                
                {/*Cabecera del Perfil */}
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

                {/* Filtros (Publicaciones / Fotos) */}
                <div className="profileFilters">
                    <button 
                        className={filtro === 'todos' ? "filterActive" : "filterButton"}
                        onClick={() => setFiltro('todos')}
                    >
                        Publicaciones
                    </button>
                    <button 
                        className={filtro === 'fotos' ? "filterActive" : "filterButton"}
                        onClick={() => setFiltro('fotos')}
                    >
                        Fotos
                    </button>
                </div>

                {/* Contenido Lista de Fotos) */}
                {filtro === 'todos' ? (
                    
                   
                    <div className="postList">
                        {posteosFiltrados.length === 0 ? (
                            <p className="p-4">No hay publicaciones para mostrar.</p>
                        ) : (
                            posteosFiltrados.map(posteo => {
                                // Comprueba el estado de este posteo
                                const estaLikeado = likedPosts.has(posteo.id);
                                const estaDestacado = highlightedPosts.has(posteo.id);
                                
                                return (
                                    // clase dinámica si está destacado
                                    <article 
                                        key={posteo.id} 
                                        className={`postCard ${estaDestacado ? 'postCard-highlighted' : ''}`}
                                    >
                                        <p className="postDescription-truncated">{posteo.description}</p>
                                        {posteo.tieneFoto && posteo.imagenUrl && (
                                            <img src={posteo.imagenUrl} alt="Imagen del posteo" className="postImage"/>
                                        )}
                                        
                                        {/* Barra de botones */}
                                        <div className="postActions">
                                            <button 
                                                className={`actionButton likeButton ${estaLikeado ? 'liked' : ''}`}
                                                onClick={() => toggleLike(posteo.id)}
                                            >
                                                <i className={`bi ${estaLikeado ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                <span>Like</span>
                                            </button>
                                            <button className="actionButton" onClick={() => handleOpenModal(posteo)}>
                                                <i className="bi bi-chat"></i>
                                                <span>Comentarios ({posteo.comments.length})</span>
                                            </button>
                                            <button 
                                                className={`actionButton highlightButton ${estaDestacado ? 'highlighted' : ''}`}
                                                onClick={() => toggleHighlight(posteo.id)}
                                            >
                                                <i className={`bi ${estaDestacado ? 'bi-star-fill' : 'bi-star'}`}></i>
                                                <span>Destacar</span>
                                            </button>
                                            <button 
                                                className="actionButton seeMoreButton"
                                                onClick={() => handleOpenModal(posteo)}
                                            >
                                                <i className="bi bi-box-arrow-up-right"></i>
                                                <span>Ver más</span>
                                            </button>
                                        </div>
                                        
                                        {/* Vista previa de hasta 2 comentarios */}
                                        <div className="commentPreviewList">
                                            {posteo.comments.slice(0, 2).map(comment => (
                                                <div key={comment.id} className="commentPreviewItem">
                                                    <strong>{comment.User?.nickName || 'Anónimo'}:</strong>
                                                    <span>{comment.content}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                )
                            })
                        )}
                    </div>
                ) : (
                    
                    //  MODO: GRILLA DE FOTOS
                    <div className="FotosGrid">
                        {posteosFiltrados.length === 0 ? (
                            <p className="p-4 text-center grid-full-width">No hay fotos para mostrar.</p>
                        ) : (
                            posteosFiltrados.map(posteo => posteo.tieneFoto && posteo.imagenUrl && (
                                <button 
                                    key={posteo.id} 
                                    className="gridPhotoContainer"
                                    onClick={() => handleOpenModal(posteo)}
                                >
                                    <img 
                                        src={posteo.imagenUrl} 
                                        alt={`Publicación de ${perfil.nickName}`} 
                                        className="gridPhoto"
                                    />
                                    <div className="gridPhotoOverlay">
                                        <span className="gridPhotoLikeCount">
                                            <i className="bi bi-heart-fill"></i> {likedPosts.has(posteo.id) ? 1 : 0}
                                        </span>
                                        <span className="gridPhotoCommentCount">
                                            <i className="bi bi-chat-fill"></i> {posteo.comments.length}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Modal de Posteo*/}
            {isModalOpen && selectedPost && (
                <div 
                    // clases dinámicas para las animaciones
                    className={`modalBackdrop ${isModalClosing ? 'closing' : ''}`} 
                    onClick={handleCloseModal}
                >
                    <div 
                        className={`modalContent ${isModalClosing ? 'closing' : ''}`} 
                        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
                    >



                        {/* Cabecera del Modal */}
                        <div className="modalHeader">
                            <h3>Post de {perfil.nickName}</h3>
                            <button className="modalCloseButton" onClick={handleCloseModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        



                        {/* Cuerpo del Modal (con scroll) */}
                        <div className="modalBody">
                            {selectedPost.tieneFoto && selectedPost.imagenUrl && (
                                <img 
                                    src={selectedPost.imagenUrl} 
                                    alt="Imagen del posteo" 
                                    className="modalPostImage"
                                />
                            )}
                            <p className="modalPostDescription">
                                {selectedPost.description}
                            </p>
                            <hr />
                            <h5>Comentarios ({selectedPost.comments.length})</h5>



                            {/* Lista completa de comentarios */}
                            <div className="modalCommentList">
                                {selectedPost.comments.length === 0 ? (
                                    <p>No hay comentarios aún.</p>
                                ) : (
                                    selectedPost.comments.map(comment => (
                                        <div key={comment.id} className="commentItem">
                                            <strong>{comment.User?.nickName || 'Anónimo'}</strong>
                                            <p>{comment.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        {/* Pie del Modal (para escribir comentario) */}
                        <div className="modalFooter">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Escribe un comentario..."
                                value={newCommentText} 
                                onChange={(e) => setNewCommentText(e.target.value)} 
                                disabled={isSubmitting} 
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={handlePostComment} 
                                disabled={isSubmitting} 
                            >
                                {isSubmitting ? "Enviando..." : "Enviar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}