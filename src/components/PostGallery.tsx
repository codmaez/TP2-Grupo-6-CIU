import { useEffect, useState } from "react";

interface PostImage {
    PostId: number;
    createdAt: string;
    id: number;
    updatedAt: string;
    url: string;
}

interface PostGalleryProps {
    postId: number;
    detailed: boolean;
}

export default function PostGallery({ postId, detailed }: PostGalleryProps){
    const [postImgs, setPostImgs] = useState<PostImage[]>([]);
    const [imgMain, setImgMain] = useState<number>(0);

    const getImages = async () => {
        try{
            const res = await fetch(`http://localhost:3001/postimages/post/${postId}`);
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
        <>
            { 
                !detailed ?
                    <div className="mt-2 d-flex flex-column flex-md-row" style={{ display: Array.isArray(postImgs) && postImgs.length > 0 ? 'flex' : 'none' }}>
                        <img
                            src={postImgs[imgMain]?.url}
                            className='border border-secondary p-1 rounded img-fluid mb-2 mb-md-0 me-md-2'
                            style={{ flex: 1, height: '500px', objectFit: 'cover' }}
                        />
                        <div className='d-flex gap-2 flex-row flex-md-column' style={{ maxHeight: '500px', scrollbarWidth: 'thin', overflowY: 'auto', overflowX: 'auto' }}>
                            {
                                postImgs.map((img, i) => (
                                    <img
                                        src={img.url}
                                        key={i}
                                        className={`border rounded p-1 ${i === imgMain ? 'border-3 border-primary' : 'border-secondary'}`}
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', flexShrink: 0 }}
                                        onClick={() => setImgMain(i)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                :
                    <div className='d-flex justify-content-center position-relative w-100 py-2'>
                        <button className={`btn border-0 position-absolute top-50 start-0 translate-middle-y fs-1 ms-3 ${imgMain == 0 ? 'd-none' : ''}`} onClick={() => setImgMain(imgMain - 1)} title="Ver anterior">
                            <i className='bi bi-arrow-left-circle-fill text-gray' />
                        </button>
                        <img
                            src={postImgs[imgMain]?.url}
                            className={'w-100 p-1 border rounded border-secondary'}
                            style={{ objectFit: 'contain', maxHeight: '70dvh' }}
                        />
                        <button className={`btn border-0 position-absolute top-50 end-0 translate-middle-y fs-1 me-3 ${imgMain == postImgs.length -1 ? 'd-none' : ''}`} onClick={() => setImgMain(imgMain + 1)} title="Ver siguiente">
                            <i className='bi bi-arrow-right-circle-fill text-gray' />
                        </button>
                    </div>
            }
        </>
    )
}