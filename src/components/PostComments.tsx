import profilePic from '../assets/blank-profile.png';
import { useEffect, useState } from "react";
import { useAuth, type AuthContextType, type User } from "../context/AuthContext";

interface PostComment {
    PostId: number;
    User: User;
    UserId: number;
    content: string;
    createdAt: string;
    id: number;
    updatedAt: string;
}

interface CommentProps {
    post_id: number;
    show_comment_box: boolean;
}

export default function PostComments({ post_id, show_comment_box }: CommentProps){
    const [postComments, setPostComments] = useState<PostComment[]>([]);
    const [comment, setComment] = useState<string>('');
    const auth: AuthContextType | null = useAuth();

    const getComments = async () => {
        try{
            const res = await fetch(`http://localhost:3001/comments/post/${post_id}`);
            const comments: PostComment[] = await res.json();
            setPostComments(comments);
        } catch(err: unknown){
            if (err instanceof Error){
                alert(`Ocurrio un error al cargar los comentarios del post: ${err.message}`);
            } else{
                alert('Error desconocido al cargar imagenes del post.');
            }
        }
    }

    const sendComment = async() => {
        try{
            const res = await fetch('http://localhost:3001/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: comment,
                    userId: auth?.user?.id,
                    postId: post_id
                })
            });
            const result = await res.json();
            if (res.ok){
                await getComments();
                setComment('');
            } else{
                console.log(result);
                alert(`No se pudo publicar tu comentario`)
            }
        } catch(err: unknown){
            if (err instanceof Error){
                alert(`Ocurrio un error al enviar tu comentario: ${err.message}`);
            } else{
                alert('Error desconocido al enviar tu comentario.');
            }
        }
    }

    useEffect(() => {
        getComments();
    }, [])

    return(
        <div className='mt-2'>
            <div className={`${show_comment_box ? 'd-flex' : 'd-none'} position-relative`}>
                <input className='rounded border border-secondary w-100 position-relative p-2 mb-2 form-control shadow-none' placeholder='Escribir un comentario...' onChange={(e) => setComment(e.target.value)} value={comment}/>
                <button className='btn border-0 position-absolute pe-0 p-md-0' style={{ right: '.5rem' }} onClick={() => sendComment()}>
                    <i className='bi bi-arrow-right-circle-fill text-primary fs-3'/>
                </button>
            </div>
            <div className='my-2'>
                {
                    Array.isArray(postComments) && postComments.map((comment, i) => (
                        <div className='d-flex rounded p-1 mt-1' style={{ backgroundColor: '#f3f3f3' }} key={i}>
                            <div className='my-auto'>
                                <img className="border rounded-circle" style={{ width: '30px', height: '30px', maxWidth: '30px', maxHeight: '30px' }} src={profilePic} />
                            </div>
                            <div className='ms-2' style={{ fontSize: '0.8rem' }}>
                                <div className='d-flex'>
                                    <b>{comment.User.nickName.charAt(0).toUpperCase() + comment.User.nickName.slice(1)}</b>
                                    <p className='mb-0 ms-1 text-muted'>{`${new Date(comment.createdAt).toLocaleString('es-AR')}hs`}</p>
                                </div>
                                <div>{comment.content}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <p className='mb-0 text-muted' style={{ fontSize: '.7rem' }}>{postComments.length} {postComments.length > 1 ? 'comentarios visibles.' : 'comentario visible.'}</p>
        </div>
    )
}