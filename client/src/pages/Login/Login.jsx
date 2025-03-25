import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', { 
                email, 
                password 
            });
            
            if (rememberMe) {
                localStorage.setItem('token', response.data.token);
            } else {
                sessionStorage.setItem('token', response.data.token);
            }

            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div 
                    className="login-container p-4 rounded shadow" 
                    style={{ 
                        maxWidth: '350px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef' 
                    }}
                >
                    <h2 className="text-center mb-4">Login</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-3 position-relative">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="form-control rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Enter your password"
                            />
                           
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="form-check-input"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" className="form-check-label">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn w-100 ${isLoading ? 'disabled' : ''}`}
                            style={{ 
                                backgroundColor: '#00bcd4', 
                                color: 'white', 
                                border: 'none' 
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    
                </div>
            </main>
        </div>
    );
};

export default Login;