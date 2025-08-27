import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!authService.validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    if (!authService.validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const userData = authMode === 'login' 
        ? await authService.login(email, password)
        : await authService.register(email, password);
      
      onAuthSuccess(userData);
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await authService.loginWithGoogle();
      onAuthSuccess(userData);
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Beautiful Forest Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-300 to-blue-200"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%2394d3a2'/%3E%3Cpath d='M20 100c0-20 20-40 40-40s40 20 40 40' fill='%2368d391'/%3E%3Ccircle cx='30' cy='30' r='15' fill='%2348cc6c' opacity='0.7'/%3E%3Ccircle cx='70' cy='20' r='20' fill='%2348cc6c' opacity='0.6'/%3E%3Cpath d='M0 100c10-30 30-50 50-50s40 20 50 50' fill='%2368d391' opacity='0.8'/%3E%3C/svg%3E")`
        }}
      >
        {/* Layered Forest Elements */}
        <div className="absolute inset-0">
          {/* Background Trees */}
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-green-400 via-green-300 to-transparent opacity-70"></div>
          
          {/* Winding River */}
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/3">
            <div className="w-full h-full bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 rounded-t-full opacity-80 transform rotate-12"></div>
          </div>
          
          {/* Tree Silhouettes */}
          <div className="absolute bottom-0 left-1/6 w-8 h-32 bg-green-600 opacity-60 rounded-t-full"></div>
          <div className="absolute bottom-0 right-1/6 w-10 h-40 bg-green-700 opacity-50 rounded-t-full"></div>
          <div className="absolute bottom-0 left-1/3 w-6 h-24 bg-green-800 opacity-70 rounded-t-full"></div>
          
          {/* Soft Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-100 via-transparent to-transparent opacity-30"></div>
        </div>
      </div>
      
      {/* Floating Sign-in Card */}
      <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/20 transform hover:scale-105 transition-all duration-300">
        
        {/* Nature-inspired header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4 animate-pulse">�</div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">
            {authMode === 'login' ? 'Welcome back to your journey' : 'Begin your path'}
          </h2>
          <p className="text-stone-600 mt-2">
            {authMode === 'login' ? 'Ready to nurture your habits?' : 'Let your habits grow naturally'}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-stone-900 placeholder-stone-500"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-stone-900 placeholder-stone-500 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? 'Loading...' : (authMode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            {authMode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
