import { Outlet } from "react-router-dom";
import NavBar from "../components/navBar";

export default function Layout() {
    
    return(
        <div className="d-flex flex-column flex-md-row">
            <NavBar/>
            <Outlet />
        </div>
    )
}