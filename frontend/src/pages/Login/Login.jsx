import { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useAuth();
    const navigate = useNavigate();

   async function onSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5050/users/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers:{
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (res.ok) {
                login(data.user, data.accessToken);
                navigate('/');
            } else {
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Network error. Please try again.");
        }
    }

return (
    <>


        <div className='container'>
            <div className='login-container'>
                <h2>Login</h2>

                {/* Form */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={onSubmit} className=''>
                    <div className='form-input' >
                        <label >Email Address</label>
                        <input type="email" placeholder='Enter your email' value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </div>


                    <div className='form-input' >
                        <label >Password</label>
                        <input type="password" placeholder='Enter your password' value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </div>

                    <button type="submit" className="btn">Login</button>
                </form>

                {/* register Page link */}
                <div className='register-btn'>
                    <p>
                        Don’t have an account?
                       <Link to="/register" > Register Here</Link>
                    </p>
                </div>
            </div>
        </div>
    </>
)
}

export default Login