import { Link } from 'react-router-dom';
import { useAuth, type AuthContextType } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import logo from '../assets/Logo2.png'; 

export default function NavBar() {
    const auth: AuthContextType | null = useAuth();
    const [selected, setSelected] = useState<number>(0);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pantallaCelullar = width <= 480;

    return (
        <div 
            className="d-flex flex-row flex-md-column position-sticky top-0 bg-white"
            style={{
                height: width > 765 ? '100vh' : 'auto',
                width: pantallaCelullar ? '100vw' : 'auto',
                overflowX: 'hidden',
                zIndex: 10,
                padding: pantallaCelullar ? '0.25rem' : '0.75rem',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                minWidth: '200px'
            }}
        >
            {/* Logo visible solo en pantallas medianas o grandes */}
            <div className='d-none d-md-flex justify-content-center w-100 mb-3 mt-2'>
                <Link to='/'>
                    <img 
                        src={logo} 
                        alt="Logo UNaHur Anti-Social Net" 
                        className="w-100 h-auto" 
                        style={{ maxWidth: '120px' }} 
                    />
                </Link>
            </div>

            <hr className='d-none d-md-block w-100'/>

            {/* Contenedor de enlaces principales */}
            <div 
                className={`d-flex ${width < 765 ? 'flex-row justify-content-around w-100' : 'flex-column w-100 align-items-start'}`}
                style={{ flexWrap: 'nowrap' }}
            >

                {/* INICIO */}
                <Link 
                    to='/' 
                    className={`d-flex ${pantallaCelullar ? 'flex-column' : 'flex-row'} align-items-center justify-content-center rounded m-1 text-decoration-none w-100`} 
                    style={{ 
                        borderLeft: !pantallaCelullar && selected === 0 ? '4px solid #1da1f2' : '',
                        backgroundColor: selected === 0 ? '#1da0f210' : '', 
                        padding: pantallaCelullar ? '0.5rem' : '0.75rem 1rem',
                        transition: 'all 0.2s ease',
                    }} 
                    onClick={() => setSelected(0)}
                >
                    <i 
                        className="bi bi-house-door"
                        style={{
                            fontSize: pantallaCelullar ? '1.3rem' : '1.2rem',
                            color: selected === 0 ? '#1da1f2' : '#333',
                            marginRight: !pantallaCelullar ? '8px' : '0',
                            marginBottom: pantallaCelullar ? '4px' : '0',
                        }}
                    />
                    <span 
                        className="fw-semibold text-dark"
                        style={{
                            fontSize: pantallaCelullar ? '0.75rem' : '1rem',
                            color: selected === 0 ? '#1da1f2' : '#333'
                        }}
                    >
                        Inicio
                    </span>
                </Link>

                {/* PERFIL */}
                <Link 
                    to='/perfil' 
                    className={`d-flex ${pantallaCelullar ? 'flex-column' : 'flex-row'} align-items-center justify-content-center rounded m-1 text-decoration-none w-100`} 
                    style={{ 
                        borderLeft: !pantallaCelullar && selected === 1 ? '4px solid #1da1f2' : '',
                        backgroundColor: selected === 1 ? '#1da0f210' : '', 
                        padding: pantallaCelullar ? '0.5rem' : '0.75rem 1rem',
                        transition: 'all 0.2s ease',
                    }} 
                    onClick={() => setSelected(1)}
                >
                    <i 
                        className="bi bi-person-fill"
                        style={{
                            fontSize: pantallaCelullar ? '1.3rem' : '1.2rem',
                            color: selected === 1 ? '#1da1f2' : '#333',
                            marginRight: !pantallaCelullar ? '8px' : '0',
                            marginBottom: pantallaCelullar ? '4px' : '0',
                        }}
                    />
                    <span 
                        className="fw-semibold text-dark"
                        style={{
                            fontSize: pantallaCelullar ? '0.75rem' : '1rem',
                            color: selected === 1 ? '#1da1f2' : '#333'
                        }}
                    >
                        Perfil
                    </span>
                </Link>

                {/* PUBLICAR */}
                <Link 
                    to='/newPost' 
                    className={`d-flex ${pantallaCelullar ? 'flex-column' : 'flex-row'} align-items-center justify-content-center rounded m-1 text-decoration-none w-100`} 
                    style={{ 
                        borderLeft: !pantallaCelullar && selected === 2 ? '4px solid #1da1f2' : '',
                        backgroundColor: selected === 2 ? '#1da0f210' : '', 
                        padding: pantallaCelullar ? '0.5rem' : '0.75rem 1rem',
                        transition: 'all 0.2s ease',
                    }} 
                    onClick={() => setSelected(2)}
                >
                    <i 
                        className="bi bi-plus-square"
                        style={{
                            fontSize: pantallaCelullar ? '1.3rem' : '1.2rem',
                            color: selected === 2 ? '#1da1f2' : '#333',
                            marginRight: !pantallaCelullar ? '8px' : '0',
                            marginBottom: pantallaCelullar ? '4px' : '0',
                        }}
                    />
                    <span 
                        className="fw-semibold text-dark"
                        style={{
                            fontSize: pantallaCelullar ? '0.75rem' : '1rem',
                            color: selected === 2 ? '#1da1f2' : '#333'
                        }}
                    >
                        Publicar
                    </span>
                </Link>
            </div>

            {/* BOTÓN CERRAR SESIÓN */}
            <button 
                onClick={() => auth?.logout()} 
                className={`d-flex ${pantallaCelullar ? 'flex-column' : 'flex-row'} align-items-center justify-content-center rounded bg-white m-1 border-0 mt-auto w-100`} 
                style={{ 
                    color: 'red',
                    padding: pantallaCelullar ? '0.5rem' : '0.75rem 1rem',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                }}
            >
                <i 
                    className="bi bi-box-arrow-right"
                    style={{
                        fontSize: pantallaCelullar ? '1.3rem' : '1.2rem',
                        marginRight: !pantallaCelullar ? '8px' : '0',
                        marginBottom: pantallaCelullar ? '4px' : '0'
                    }}
                />
                <span 
                    className="fw-semibold"
                    style={{
                        fontSize: pantallaCelullar ? '0.75rem' : '1rem',
                        color: 'red'
                    }}
                >
                    Cerrar Sesión
                </span>
            </button>
        </div>
    );
}