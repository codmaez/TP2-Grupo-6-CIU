import { NavLink } from 'react-router-dom';
import { useAuth, type AuthContextType } from "../context/AuthContext";
import logo from '../assets/Logo2.png'; 
import './navBar.css';
import { useState } from "react";

export default function NavBar() {

    const auth: AuthContextType | null = useAuth();
    const [open, setOpen] = useState(false);

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        isActive ? "navButton active" : "navButton";

    const handleNavClick = () => {
        window.scrollTo(0, 0);
        setOpen(false);
    };

    return (
      <>
        {/* botón hamburguesa SOLO mobile */}
        <button className="mobileMenuBtn" onClick={() => setOpen(!open)}>
          <i className="bi bi-list"></i>
        </button>

        <aside className={`profileNav ${open ? "open" : ""}`}>
            
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

                <NavLink to="/newPost" className="navButton navButton-publish" onClick={(e) => e.preventDefault()}>
                    <i className="bi bi-plus-square"></i> 
                    <span>Publicar</span>
                </NavLink>

            </div>

            <div className="navGroup-bottom">
                
                <button className="navButton navButton-logout" onClick={() => { auth?.logout(); setOpen(false) }}>
                    <i className="bi bi-box-arrow-right"></i> 
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
      </>
    );
}
