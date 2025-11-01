import { NavLink } from 'react-router-dom';
import { useAuth, type AuthContextType } from "../context/AuthContext";
import logo from '../assets/Logo2.png'; 


import './navBar.css';



export default function NavBar() {
    

    const auth: AuthContextType | null = useAuth();


    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        isActive ? "navButton active" : "navButton";


    // hace que la página suba al tope.
    const handleNavClick = () => {
        window.scrollTo(0, 0);
    };

    return (
        <aside className="profileNav">
            
            {/*Logo*/}
            <NavLink to="/" className="navLogoLink" onClick={handleNavClick}>
                <img src={logo} alt="Logo de la App" className="navLogo" />
            </NavLink>


            <div className="navGroup-top">
                

                <NavLink to="/" className={getNavLinkClass} end onClick={handleNavClick}>
                    <i className="bi bi-house-door"></i> 
                    <span>Inicio</span>
                </NavLink>
                
                <NavLink to="/perfil" className={getNavLinkClass} onClick={handleNavClick}>
                    <i className="bi bi-person-fill"></i> 
                    <span>Perfil</span>
                </NavLink>

                {/* Botón "Publicar" para cuando se implemente el modal*/}
                <NavLink to="#" className="navButton navButton-publish" onClick={(e) => e.preventDefault()}>
                    <i className="bi bi-plus-square"></i> 
                    <span>Publicar</span>
                </NavLink>

            </div>

            {/* C. Grupo Inferior (Botón de Salir) */}
            <div className="navGroup-bottom">
                
                {/* Botón para cerrar la sesión del usuario */}
                <button className="navButton navButton-logout" onClick={auth?.logout}>
                    <i className="bi bi-box-arrow-right"></i> 
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}