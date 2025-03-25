import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { User, Lock } from 'lucide-react'; // Icons for username and password fields

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-gray-200">
            {/* Main Container */}
            <div className="flex w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 p-8 text-black relative overflow-hidden">
                    {/* Diagonal Shapes (Pseudo-elements) */}
                    <div className="absolute inset-0">
                        <div className="absolute w-64 h-64 bg-orange-400 opacity-30 rounded-full -top-32 -left-32 transform rotate-45"></div>
                        <div className="absolute w-64 h-64 bg-orange-400 opacity-30 rounded-full -bottom-32 -right-32 transform rotate-45"></div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome to Website</h1>
                    <p className="text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                    </p>
                </div>

                {/* Right Section (Login Form) */}
                <div className="w-1/2 p-8 bg-white flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">USER LOGIN</h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4" role="alert">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4" role="alert">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email Field */}
                        <div className="mb-4 relative">
                            <label htmlFor="email" className="block text-gray-600 mb-2">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User size={20} className="text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock size={20} className="text-gray-400" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="form-check-input"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-gray-600">Remember me</label>
                            </div>
                            <a href="#" className="text-blue-500 hover:underline text-sm">Forgot password?</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-700 to-pink-500 hover:from-purple-800 hover:to-pink-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                'LOGIN'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;