import profilePic from '../assets/blank-profile.png';
import { useEffect, useState } from "react";
import type { User } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import PostComments from './PostComments';

export interface PostType {
    id: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    User: User;
    Tags: Tag[];
}

interface Tag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    PostTag: {
        createdAt: string;
        updatedAt: string;
        PostId: number;
        TagId: number;
    }
}

interface PostImage {
    PostId: number;
    createdAt: string;
    id: number;
    updatedAt: string;
    url: string;
}

interface PostProps {
    post: PostType;
}

export default function Post({ post }: PostProps){
    const [postImgs, setPostImgs] = useState<PostImage[]>([]);
    const [imgMain, setImgMain] = useState<number>(0);
    const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
    const navigate = useNavigate();

    const getImages = async () => {
        try{
            const res = await fetch(`http://localhost:3001/postimages/post/${post.id}`);
            const images: PostImage[] = await res.json();
            setPostImgs(images);
        } catch(err: unknown){
            if (err instanceof Error){
                alert(`Ocurrio un error al cargar las imagenes del post: ${err.message}`);
            } else{
                alert('Error desconocido al cargar imagenes del post.');
            }
        }
    }

    useEffect(() => {
        getImages();
    }, [])

    return(
        <div className="container-fluid bg-white rounded border border-secundary p-3 m-1 w-100 shadow">
            <div className="d-flex">
                <img className="border rounded-circle" style={{ width: '50px', height: '50px', maxWidth: '50px', maxHeight: '50px' }} src={profilePic} />
                <div className="ms-2 my-auto">
                    <div>Publicado por <Link to={`/perfil/${post.UserId}`}>{ post.User.nickName.charAt(0).toUpperCase() + post.User.nickName.slice(1) }</Link></div>
                    <div className="text-muted" style={{ fontSize: '70%' }}>{ `${ new Date(post.createdAt).toLocaleString('es-AR') }hs` }</div>
                </div>
            </div>
            <div className="mt-2">{ post.description }</div>
            {/* Imagenes */}
            <div className="mt-2 d-flex flex-column flex-md-row" style={{ display: Array.isArray(postImgs) && postImgs.length > 0 ? 'flex' : 'none' }}>
                <img
                    src={postImgs[imgMain]?.url}
                    className='border border-secondary rounded img-fluid mb-2 mb-md-0 me-md-2'
                    style={{ flex: 1, height: '400px', objectFit: 'cover' }}
                />
                <div className='d-flex gap-2 flex-row flex-md-column' style={{ maxHeight: '400px', scrollbarWidth: 'thin', overflowY: 'auto', overflowX: 'auto' }}>
                    {
                        postImgs.map((img, i) => (
                            <img
                                src={img.url}
                                key={i} className={`border rounded ${i === imgMain ? 'border-3 border-primary' : 'border-secondary'}`}
                                style={{ width: '150px', height: '150px', objectFit: 'cover', flexShrink: 0 }}
                                onClick={() => setImgMain(i)}
                            />
                        ))
                    }
                </div>
            </div>
            {/* Etiquetas */}
            <div className='mt-2 d-inline-block text-muted'>
                <b>Etiquetas:</b>
                {
                    Array.isArray(post.Tags) && post.Tags.map((tag, i) => (
                        <p className='d-inline-block px-1 mb-0' key={i}>{ `${tag.name}${i < post.Tags.length -1 ? ',' : ''}` }</p>
                    ))
                }
            </div>
            {/* Acciones */}
            <div className='container-fluid d-flex justify-content-between mt-2'>
                <button className="btn w-100 mx-1" onClick={() => setShowCommentBox(!showCommentBox)}>
                    <i className="bi bi-chat me-1"/>Comentar
                </button>
                <button className="btn w-100 mx-1" onClick={() => navigate(`/post/${post.id}`)}>
                    <i className="bi bi-box-arrow-up-right me-1"/>Ver más
                </button>
            </div>
            {/* Comentarios */}
            <PostComments post_id={post.id} show_comment_box={showCommentBox} />
        </div>
    )
}