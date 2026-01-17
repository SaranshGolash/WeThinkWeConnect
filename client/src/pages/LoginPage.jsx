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

    // ✅ DEBUGGING: Check Console to see exactly what you are sending
    const payload = {
      ...( !isLoginView && { username: formData.username }),
      email: formData.email,
      password: formData.password
    };
    console.log("Sending Payload:", payload);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // ✅ FIX: Capture the exact error message from backend
        // Backend might send 'message' or 'error' key
        throw new Error(data.message || data.error || 'Invalid credentials');
      }

      console.log("Login Success:", data);
      login(data.user, data.token);
      navigate(ROUTES.DASHBOARD);

    } catch (err) {
      console.error("Login Error:", err);
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
          
          {/* USERNAME FIELD: Visible on Register, hidden on Login */}
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
            <input
              type="password"
              name="password"
              required
              className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-fog focus:outline-none"
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