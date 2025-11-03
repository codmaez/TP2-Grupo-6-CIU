import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/LoginPage"
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/ProfilePage";
import Home from "./pages/HomePage";
import Register from "./pages/RegisterPage";
import PostDetails from './components/PostDetails';
import Layout from './layout/layout';

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registrar" element={<Register />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/perfil" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                        <Route path="/post/:id" element={<PostDetails />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
