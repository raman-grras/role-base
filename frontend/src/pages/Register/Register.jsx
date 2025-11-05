import './Register.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('http://localhost:5050/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    mobileNo: formData.mobileNo,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Registration successful! Please login.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('Network error. Please try again.');
        }
    };

    return (
        <>
            <div className='register'>
                <div className="register-container">
                    <h2>Create Account</h2>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobileNo">Mobile Number</label>
                            <input
                                type="tel"
                                id="mobileNo"
                                name="mobileNo"
                                placeholder="Enter your mobile number"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn">Register</button>
                    </form>

                    <div className="extra-links">
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
