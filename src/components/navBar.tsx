import { Link } from 'react-router-dom';
import { useAuth, type AuthContextType } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import logo from '../assets/Logo2.png'; 

export default function NavBar(){
    const auth: AuthContextType | null = useAuth();
    const [selected, setSelected] = useState<number>(0);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return(
        <div className='d-flex flex-row flex-md-column vh-lg-100 position-sticky top-0 justify-content-center p-2 bg-white' style={{ height: width > 765 ? '100vh' : '' }}>
            <div className='d-none d-md-flex justify-content-center'>
                <Link to='/'>
                    <img src={logo} alt="Logo UNaHur Anti-Social Net" className="w-100 h-auto" style={{ maxWidth: '150px' }} />
                </Link>
            </div>
            <hr/>
            <div className='d-flex flex-row flex-md-column'>
                <Link to='/' className='d-flex flex-column flex-md-row p-4 rounded m-1 align-items-center text-decoration-none' style={{ borderBottom: selected == 0 ? '2px solid #1da1f2' : '', backgroundColor: selected == 0 ? '#1da0f210' : '' }} onClick={() => setSelected(0)}>
                    <i className="bi bi-house-door"></i> 
                    <span className='ms-1'>Inicio</span>
                </Link>
                <Link to={`/perfil`} className='d-flex flex-column flex-md-row p-4 rounded m-1 align-items-center text-decoration-none' style={{ borderBottom: selected == 1 ? '2px solid #1da1f2' : '', backgroundColor: selected == 1 ? '#1da0f210' : '' }} onClick={() => setSelected(1)}>
                    <i className="bi bi-person-fill"/>
                    <span className='ms-1'>Perfil</span>
                </Link>
                <Link to='/newPost' className='d-flex flex-column flex-md-row p-4 rounded m-1 align-items-center text-decoration-none' style={{ borderBottom: selected == 2 ? '2px solid #1da1f2' : '', backgroundColor: selected == 2 ? '#1da0f210' : '' }} onClick={() => setSelected(2)}>
                    <i className="bi bi-plus-square"/>
                    <span className='ms-1'>Publicar</span>
                </Link>
            </div>
            <button onClick={() => auth?.logout()} className='d-flex flex-column flex-md-row p-4 rounded bg-white m-1 align-items-center border-0 mt-auto' style={{ color: 'red' }}>
                <i className="bi bi-box-arrow-right"/>
                <span className='ms-1'>Cerrar Sesión</span>
            </button>
        </div>
    )
}