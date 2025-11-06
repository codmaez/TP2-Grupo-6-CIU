import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import image_banner from '../assets/banner.png';
import image_logo from '../assets/Logo.png';

export default function RegisterPage(){
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // decorativo
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nickName || !email || !password){
            setError('Todos los campos son obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try{
            const res = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickName, email }) // password no se guarda
            });

            if(!res.ok){
                setError("No se pudo crear el usuario");
                setLoading(false);
                return;
            }

            alert("Usuario creado con éxito ✅\n\n⚠️ Para iniciar sesión usa la contraseña 123456");
            navigate('/login');

        } catch {
            setError("Error al crear el usuario");
        } finally{
            setLoading(false);
        }
    }

    return(
        <div className='container-fluid bg-primary vh-100 d-flex'>
            <div className='row flex-column flex-md-row vw-100'>
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
                            <p className='text-muted'>Crea tu cuenta para ingresar al sitio.</p>
                        </div>
                        <hr className='my-4'/>

                        {error && (
                            <div className="alert alert-danger text-center py-2">{error}</div>
                        )}

                        <div className='mb-3'>
                            <label className='form-label ms-2 fw-bold text-muted'>NickName</label>
                            <input type='text' className='form-control' value={nickName} onChange={e=>setNickName(e.target.value)}/>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label ms-2 fw-bold text-muted'>Email</label>
                            <input type='email' className='form-control' value={email} onChange={e=>setEmail(e.target.value)}/>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label ms-2 fw-bold text-muted'>Contraseña</label>
                            <input type='password' className='form-control' value={password} onChange={e=>setPassword(e.target.value)}/>
                        </div>

                        <button type='submit' className='btn btn-primary w-100 p-2 fw-bold' disabled={loading}>
                            {loading ? 'Creando...' : 'Registrarse'}
                        </button>

                        <hr className='my-4'/>
                        <p className='text-center text-muted'>¿Ya tenes cuenta? <Link to='/login'>Inicia sesión</Link>.</p>
                    </form>
                </div>
            </div>
        </div>
    )
}
