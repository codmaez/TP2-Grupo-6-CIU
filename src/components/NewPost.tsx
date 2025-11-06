import { useEffect, useState } from "react";
import { useAuth, type AuthContextType } from "../context/AuthContext"

interface Tag {
    id: number, 
    name: string,
    createdAt: string, 
    updatedAt: string 
}

export default function NewPost(){
    const auth: AuthContextType | null = useAuth();
    const [width, setWidth] = useState(window.innerWidth);
    const [description, setDescription] = useState<string>('');
    const [inputImage, setInputImage] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [labels, setLabels] = useState<Tag[]>([]);
    const [selectedLabelsIds, setSelectedLabelsIds] = useState<number[]>([]);
    
    const getLabels=async ()=>{
        try {
            const res = await fetch("http://localhost:3001/tags");
            const data = await res.json();
            setLabels(data);
        }catch (err:unknown){
            if(err instanceof Error){
                alert(`Ocurrio un error al obtener las etiquetas ${err.message}`)
            }
            else {
                alert(`Ocurrio un error desconocido al obtener las etiquetas`)
            }
        }
    }

    const addImage = ()=>{
        if(inputImage.trim().length > 0){
            setImages((prev)=>[...prev, inputImage]);
            setInputImage("");
        } else{
            alert('Ingrese la URL de una imagen a subir.')
        }
    }

    const submitPost = async ()=>{
        if (description.trim().length > 0){
            try {
                const res = await fetch("http://localhost:3001/posts", {
                    method:"POST", 
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        description: description,
                        userId: auth?.user?.id,
                        tagIds: selectedLabelsIds
                    })
                })
                if (!res.ok) {
                    console.log(res);
                    throw new Error(`Ocurrio un error al subir post ${res.status} ${res.statusText}`);
                }
                else {
                    const postData = await res.json();
                    if (images.length > 0) {
                        images.map(async (image)=>{
                            const res = await fetch("http://localhost:3001/postimages", {
                                method:"POST", 
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({
                                    url: image,
                                    postId: postData.id
                                })
                            })
                            if (!res.ok) {
                                console.log(res);
                                throw new Error(`Ocurrio un error al subir imagen con url ${image} ${res.status} ${res.statusText}`)
                            }
                        })
                    } 
                }
                alert('Post agregado!')
                setDescription('');
                setImages([]);
                setLabels([]);
            } catch(err: unknown){
                if(err instanceof Error){
                    alert(`Ocurrio un error al publicar el post: ${err.message}`)
                }
                else {
                    alert (`ocurrio un error desconocido`)
                }
            }
        } else{
            alert('La descripción del post no puede estar vacía.')
        }
    }
    
    const calcWidth = ()=> {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }

    const handleSelectedLabel = (label:Tag)=> {
        if(selectedLabelsIds.includes(label.id)){
            setSelectedLabelsIds(selectedLabelsIds.filter(id => id !== label.id))
        }
        else{
            setSelectedLabelsIds([...selectedLabelsIds, label.id])
        }
    }

    useEffect(() => {
        calcWidth();
        getLabels();
    }, []);

    return (
        <div className={`bg-white rounded p-4 m-4 d-flex flex-column align-content-center mx-4 ${ width < 759 ? 'mx-lg-auto' : 'w-100 mx-auto'}`} style={{ maxWidth: '1200px' }}>
            <p className="text-primary fw-bold">Nueva Publicación</p>
            <textarea className="w-100 rounded p-2" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Descripción" required/>
            <div className="d-flex flex-column mt-3 p-3 border rounded">
                <label className="position-absolute bg-white px-1" style={{transform: "translateY(-30px)"}}>Imagen</label>
                <div className="my-2">
                    {
                        images.map((imgUrl, index) => (
                            imgUrl.trim() && <img key={index} src={imgUrl} alt={`Preview ${index}`} width="50" height="50" className="me-1 rounded object-fit-cover" />
                        ))
                    }
                </div>
                <div className="d-flex">
                    <input value={inputImage} onChange={(e)=>setInputImage(e.target.value)} className="w-100 border rounded p-2" type="text" placeholder="Ingrese URL de imagen"/>
                    <button onClick={addImage} className="ms-2 btn btn-primary" style={{ width: '14rem' }}>Agregar imagen</button>
                </div>
            </div>
            <div className="d-flex mt-3 p-3 border rounded">
                <label className="position-absolute bg-white px-1" style={{transform: "translateY(-30px)"}}>Seleccione etiquetas</label>
                {
                    Array.isArray(labels) && labels.map((label, i) => (
                        <div 
                            key={i}  
                            onClick={() => handleSelectedLabel(label)}
                            className={`border rounded me-2 p-1 ${selectedLabelsIds.includes(label.id) ? "bg-primary text-white" : "bg-white"}`}
                            style={{cursor:"pointer" }}
                        >{label.name}</div>)
                    )
                }
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={submitPost} className="btn btn-primary px-5 mt-3">Publicar</button>
            </div>    
        </div>
    )
}