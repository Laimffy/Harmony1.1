import React, { useState } from 'react';
import type { User } from '../types';
import { authAPI, setAuthToken } from '../services/apiService';

interface LoginFormProps {
  onLogin: (token: string, user: User) => void;
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await authAPI.login(email, password);
      
      // Store the auth token
      if (data.access_token) {
        setAuthToken(data.access_token);
      }
      
      // On successful login, call the onLogin prop with token and user data
      onLogin(data.access_token, data.user);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Triggering Google OAuth flow...");
    // Placeholder for Google login logic
  };

  const handleFacebookLogin = () => {
    console.log("Triggering Facebook OAuth flow...");
     // Placeholder for Facebook login logic
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200">
      <h1 className="text-3xl font-bold text-purple-900 mb-2 text-center">Sign in to Harmony</h1>
      <p className="text-center text-purple-700 mb-6">Sign in to save your translation history and set preferences.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-purple-800">Email</label>
          <input type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-purple-800">Password</label>
          <input type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-purple-800">Remember me</label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="mt-6">
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div></div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Sign in with Google</button>
          <button onClick={handleFacebookLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Sign in with Facebook</button>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Not a member? <button onClick={onSwitchToSignup} className="font-medium text-purple-600 hover:text-purple-500">Create an account</button>
      </p>
    </div>
  );
};

export default LoginForm;