import image_banner from '../assets/banner.png';
import image_logo from '../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type AuthContextType } from '../context/AuthContext';
import { useEffect, useState, type FormEvent } from 'react';

export default function LoginPage(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const auth: AuthContextType | null = useAuth();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        auth?.login(username, password);
    }

    useEffect(() => {
        if (auth?.user){
            navigate('/');
        }
    }, [auth])

    return(
        <div className='container-fluid bg-primary vh-100 d-flex'>
            <div className='row flex-column flex-md-row'>
                <div className='col align-items-center justify-content-center d-none d-md-flex'>
                    <img src={image_banner} alt='banner' className='img-fluid' />
                </div>
                <div className='col m-auto d-flex flex-column align-items-center justify-content-center'>
                    <div className='align-items-center justify-content-center d-flex d-md-none mb-5' style={{ maxHeight: '100px' }}>
                        <img src={image_logo} alt='logo' className='img-fluid' style={{ maxHeight: '100px' }}/>
                    </div>
                    <form className='bg-white m-3 p-3 shadow rounded' onSubmit={handleSubmit}>
                        <div className='text-center'>
                            <h2 className='fw-bold d-none d-md-flex'>UNaHur Anti-Social Net</h2>
                            <p className='text-muted'>Inicie sesión o registrese para acceder al sitio.</p>
                        </div>
                        <hr className='my-4'/>
                        <div className='mb-3'>
                            <label htmlFor='input_usuario' className='form-label ms-2 fw-bold text-muted'>Usuario</label>
                            <input type='text' className='form-control' id='input_usuario' onChange={(e) => setUsername(e.target.value)} value={username} required />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='input_password' className='form-label ms-2 fw-bold text-muted'>Contraseña</label>
                            <input type='password' className='form-control' id='input_password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </div>
                        <button type='submit' className='btn btn-primary w-100 p-2 fw-bold' disabled={auth?.loading}>Iniciar sesión</button>
                        <hr className='my-4'/>
                        <p className='text-center text-muted'>Si no tenes una cuenta, <Link to='/registrar'>registrate</Link>.</p>
                    </form>
                </div>
            </div>
        </div>
    )
}