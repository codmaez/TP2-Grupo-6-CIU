import { useState } from "react";
import { useAuth, type AuthContextType } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

export default function NewPost(){
    const auth: AuthContextType | null = useAuth();
    const [description, setDescription]=useState<string>('');
    const [inputImage, setInputImage]=useState<string>('');
    const [images, setImages]=useState<string[]>([]);
    const [labels, setLabels]=useState<string[]>([]);
    const navigate = useNavigate();
    
    const addImage = ()=>{
        setImages((prev)=>[...prev, inputImage]);
        setInputImage("");
    }
    const submitPost = async ()=>{
        try {
            const res = await fetch("http://localhost:3001/posts", {
                method:"POST", 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    description: description,
                    userId: auth?.user?.id,
                    tagIds: labels
                })
            })
            if (!res.ok) {
                throw new Error("Ocurrio un error")
            }
            else {
                if (images.length > 0) {
                    images.map(async (image)=>{
                        const res = await fetch("http://localhost:3001/postimages", {
                            method:"POST", 
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                url:image,
                                postId:auth?.user?.id
                            })
                        })
                        if (!res.ok) {
                            throw new Error(`Ocurrio un error al subir imagen con url ${image}`)
                        }
                    })
                } 
            } 
            navigate("/");
        } catch(err: unknown){
            if(err instanceof Error){
                alert(`Ocurrio un error al publicar el post: ${err.message}`)
            }
            else {
                alert (`ocurrio un error desconocido`)
            }
        }
    
    }


    return (
        <div className="w-100 bg-white rounded p-2 m-2">
            <p className="text-primary fw-bold">Nueva Publicación</p> 
            <textarea className="w-100 rounded p-2" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Descripción" required/>
            <div className="d-flex mt-3 p-3 border rounded">
                <label className="position-absolute" style={{transform: "translateY(-30px)"}}>Imagen</label>
                <input value={inputImage} onChange={(e)=>setInputImage(e.target.value)} className="w-100 border rounded p-2" type="text" placeholder="Ingrese URL de imagen"/>
                <button onClick={addImage} className="ms-2 btn btn-primary">Agregar imagen</button>
            </div>
            <div className="d-flex mt-3 p-3 border rounded">
                <label className="position-absolute" style={{transform: "translateY(-30px)"}}>Etiquetas</label>
                <input type="text" value={labels?.join(",")} onChange={(e)=>setLabels(e.target.value.split(",").map(label=>label.trim()))} placeholder="Ingrese etiquetas separadas por comas" className="mt-2 border rounded p-2"/>
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={submitPost} className="btn btn-primary px-5 mt-3">Publicar</button>
            </div>    
        </div>
    )
}