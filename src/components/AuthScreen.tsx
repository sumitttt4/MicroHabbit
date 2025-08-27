import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  onBack?: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onBack }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-stone-50 flex items-center justify-center p-6">
      {/* Sign-in Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm border border-stone-200 transform hover:scale-105 transition-all duration-300">

        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-4 -left-4 bg-white border border-stone-200 rounded-full p-2 shadow hover:shadow-md transition-all"
            aria-label="Back"
          >
            ‹
          </button>
        )}
        
        {/* Nature-inspired header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌿</div>
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
