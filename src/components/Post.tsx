import profilePic from '../assets/blank-profile.png';
import { useState } from "react";
import type { User } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import PostComments from './PostComments';
import PostGallery from './PostGallery';

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

interface PostProps {
    post: PostType;
    detailed?: boolean;
}

export default function Post({ post, detailed = false }: PostProps){
    const [showCommentBox, setShowCommentBox] = useState<boolean>(detailed);
    const navigate = useNavigate();

    return(
        <div className={`container-fluid bg-white w-100 ${detailed ? ' p-3 m-1 rounded border border-secundary shadow' : ''}`}>
            <div className="d-flex">
                <img className="border rounded-circle" style={{ width: '50px', height: '50px', maxWidth: '50px', maxHeight: '50px' }} src={profilePic} />
                <div className="ms-2 my-auto">
                    <div>Publicado por <b>{ post.User.nickName.charAt(0).toUpperCase() + post.User.nickName.slice(1) }</b></div>
                    <div className="text-muted" style={{ fontSize: '70%' }}>{ `${ new Date(post.createdAt).toLocaleString('es-AR') }hs` }</div>
                </div>
            </div>
            <div className="mt-2">{ post.description }</div>
            {/* Imagenes */}
            <PostGallery postId={post.id} detailed={detailed} />
            {/* Etiquetas */}
            <div className='mt-2 d-inline-block text-muted'>
                {
                    Array.isArray(post.Tags) && post.Tags.map((tag, i) => (
                        <p className='d-inline-block px-1 mb-0 rounded mt-2 text-primary' key={i}>{ `#${tag.name}${i < post.Tags.length -1 ? ',' : ''}` }</p>
                    ))
                }
            </div>
            {/* Acciones */}
            <div className={`container-fluid justify-content-between mt-2 ${detailed ? 'd-none' : 'd-flex'}`}>
                <button className="btn w-100 mx-1" onClick={() => setShowCommentBox(!showCommentBox)}>
                    <i className="bi bi-chat me-1"/>Comentar
                </button>
                <button className="btn w-100 mx-1" onClick={() => navigate(`/post/${post.id}`)}>
                    <i className="bi bi-box-arrow-up-right me-1"/>Ver más
                </button>
            </div>
            <button className={`btn w-100 mx-1 ${detailed ? '' : 'd-none'}`} onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left-circle me-1"/>Volver atrás
            </button>
            {/* Comentarios */}
            <PostComments post_id={post.id} show_comment_box={showCommentBox} />
        </div>
    )
}