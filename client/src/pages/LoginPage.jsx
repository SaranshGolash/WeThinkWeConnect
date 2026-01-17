import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../routes';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth(); 
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ 1. State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLoginView 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    const payload = {
      ...( !isLoginView && { username: formData.username }),
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 border-white/10 shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLoginView ? 'Welcome Back' : 'Join WeThinkWeConnect'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLoginView ? 'Resume your unfinished thoughts.' : 'Start your journey to radical empathy.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginView && (
            <div className="animate-fade-in-down">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none"
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full bg-black/20 border border-white/10 rounded p-3 pr-10 text-white focus:border-fog focus:outline-none"
                onChange={handleChange}
              />
              
              <button
                type="button" // Important: Prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="fog" 
            className="w-full mt-6" 
            isLoading={isLoading}
          >
            {isLoginView ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
            className="text-white underline hover:text-fog transition-colors"
          >
            {isLoginView ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;