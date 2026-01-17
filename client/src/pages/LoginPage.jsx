import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../routes';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useContext(AuthContext);
  
  // State
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let result;
    if (isLoginView) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.username, formData.email, formData.password);
    }

    setIsLoading(false);

    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLoginView ? 'Welcome Back' : 'Join WeThinkWeConnect'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLoginView ? 'Resume your unfinished thoughts.' : 'Start your journey to radical empathy.'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded mb-6 text-center">
            {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none transition"
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
              className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none transition"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none transition"
              onChange={handleChange}
            />
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

        {/* Toggle View */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
            className="text-white underline hover:text-fog"
          >
            {isLoginView ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;