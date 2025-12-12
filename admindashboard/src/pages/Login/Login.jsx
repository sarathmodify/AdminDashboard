import React, { useEffect, useState } from 'react';
import './Login.css';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate('/dashboard', { replace: true }); //navigate to dashboard
            }
        }
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
        if (!email) {
            newError.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            newError.email = "Invalid email address";
        }
        if (!password) {
            newError.password = "Password is required";
        } else if (password.length < 8) {
            newError.password = "Password must be at least 8 characters long";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email, password
            })
            if (error) {
                setError({ general: error.message });
                return;
            }
            setEmail('');
            setPassword('');
            setShowPassword(false);
            setFocusedField(null);
            setError('');
            navigate('/dashboard', { replace: true }); //navigate to dashboard
        }
    }

    return (
        <div className="login-container">
            {/* Animated background */}
            <div className="login-bg-gradient"></div>
            <div className="login-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Login Card */}
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="12" fill="url(#gradient)" />
                            <path d="M24 14C19.58 14 16 17.58 16 22C16 26.42 19.58 30 24 30C28.42 30 32 26.42 32 22C32 17.58 28.42 14 24 14ZM24 28C20.69 28 18 25.31 18 22C18 18.69 20.69 16 24 16C27.31 16 30 18.69 30 22C30 25.31 27.31 28 24 28Z" fill="white" />
                            <path d="M24 32C18.48 32 14 33.79 14 36V38H34V36C34 33.79 29.52 32 24 32ZM16 36C16.2 35.29 19.3 34 24 34C28.7 34 31.8 35.29 32 36H16Z" fill="white" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#667eea" />
                                    <stop offset="1" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" autoComplete='off'>
                    {/* General Error Message */}
                    {error.general && (
                        <div className="general-error-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.28033 7.21967C7.98744 6.92678 7.51256 6.92678 7.21967 7.21967C6.92678 7.51256 6.92678 7.98744 7.21967 8.28033L8.93934 10L7.21967 11.7197C6.92678 12.0126 6.92678 12.4874 7.21967 12.7803C7.51256 13.0732 7.98744 13.0732 8.28033 12.7803L10 11.0607L11.7197 12.7803C12.0126 13.0732 12.4874 13.0732 12.7803 12.7803C13.0732 12.4874 13.0732 12.0126 12.7803 11.7197L11.0607 10L12.7803 8.28033C13.0732 7.98744 13.0732 7.51256 12.7803 7.21967C12.4874 6.92678 12.0126 6.92678 11.7197 7.21967L10 8.93934L8.28033 7.21967Z" fill="#ef4444" />
                            </svg>
                            <span>{error.general}</span>
                        </div>
                    )}
                    {/* Email Field */}
                    <div className={`input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                        <label htmlFor="email" className="input-label">
                            Email Address
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33333 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41666 16.6667 1.66666 15.9167 1.66666 15V5.00001C1.66666 4.08334 2.41666 3.33334 3.33333 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.3333 5L9.99999 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter your email"
                                required
                                className="input-field"
                                autoComplete="off"
                            />
                        </div>
                        {error.email && <p className="error-message">{error.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className={`input-group ${focusedField === 'password' ? 'focused' : ''}`}>
                        <label htmlFor="password" className="input-label">
                            Password
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8333 9.16667H4.16666C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16666 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.83334 9.16667V5.83333C5.83334 4.72826 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 10 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter your password"
                                required
                                className="input-field"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.95 14.95C13.5255 16.0358 11.7909 16.6374 10 16.6667C4.16666 16.6667 1.66666 10 1.66666 10C2.49596 8.35557 3.64605 6.89144 5.04999 5.69167L14.95 14.95Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.25 3.53333C8.82379 3.39907 9.41097 3.33195 10 3.33333C15.8333 3.33333 18.3333 10 18.3333 10C17.9286 10.9463 17.4235 11.8473 16.8267 12.6867L8.25 3.53333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1.66666 1.66667L18.3333 18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.66666 10C1.66666 10 4.16666 3.33333 10 3.33333C15.8333 3.33333 18.3333 10 18.3333 10C18.3333 10 15.8333 16.6667 10 16.6667C4.16666 16.6667 1.66666 10 1.66666 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {error.password && <p className="error-message">{error.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="login-options">
                        <label className="checkbox-label">
                            <input type="checkbox" className="checkbox-input" />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    {/* Sign In Button */}
                    <button type="submit" className="sign-in-button">
                        <span className="button-text">Sign In</span>
                        <svg className="button-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16666 10H15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 4.16667L15.8333 10L10 15.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
