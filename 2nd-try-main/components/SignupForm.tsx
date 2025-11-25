import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../services/apiService';

interface SignupFormProps {
  onSignupSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
    setSuccess(null);

    try {
      // Split name into first and last
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const data = await authAPI.signup(name, email, password, firstName, lastName);
      
      // Store the auth token
      if (data.access_token) {
        setAuthToken(data.access_token);
      }
      
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        onSignupSuccess(data.user);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200">
      <h1 className="text-3xl font-bold text-purple-900 mb-2 text-center">Create an Account</h1>
      <p className="text-center text-purple-700 mb-6">Join Harmony to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md text-sm">{success}</p>}
        <div>
          <label htmlFor="name-signup" className="block text-sm font-medium text-purple-800">Full Name</label>
          <input type="text" id="name-signup" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-purple-800">Email</label>
          <input type="email" id="email-signup" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <label htmlFor="password-signup" className="block text-sm font-medium text-purple-800">Password</label>
          <input type="password" id="password-signup" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-purple-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
        </div>
        <div>
          <button type="submit" disabled={isLoading || !!success} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300">
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <button onClick={onSwitchToLogin} className="font-medium text-purple-600 hover:text-purple-500">Sign in</button>
      </p>
    </div>
  );
};

export default SignupForm;