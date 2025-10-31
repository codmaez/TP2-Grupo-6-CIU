import { useParams, type Params } from "react-router-dom";
import Post, { type PostType } from "./Post";
import { useEffect, useState } from "react";

export default function PostDetalle(){
    const { id } = useParams<Params>();
    const [post, setPost] = useState<PostType>();

    const loadPost = async () => {
        try{
            const res = await fetch(`http://localhost:3001/posts/${id}`);
            if (res.ok){
                const data = await res.json();
                setPost(data);
            }
        } catch(err: unknown){
            if (err instanceof Error){
                alert(`Ocurrio un error al cargar el post: ${err.message}`);
            } else{
                alert('Ocurrio un error desconocido al cargar el post.')
            }
        }
    }

    useEffect(() => {
        loadPost();
    }, [])
    
    return(
        <div className='d-flex justify-content-center'>
            {
                post ?
                    <div className='d-flex w-100 pt-5' style={{ maxWidth: '1200px' }}>
                        <Post post={post} detailed={true}/>
                    </div>
                :
                    <div>
                        <div className='spinner-border'/>
                        <p className='text-primary'>Cargando publicación...</p>
                    </div>
            }
        </div>
    )
}