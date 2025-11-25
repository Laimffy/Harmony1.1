import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AdminMessages from './AdminMessages';
import type { User } from '../types';

interface ProfileProps {
  user: User | null;
  onLogin: (token: string, user: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogin, onLogout }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  if (user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username;
    
    if (showMessages) {
      return (
        <div>
          <button
            onClick={() => setShowMessages(false)}
            className="m-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ← Back to Profile
          </button>
          <AdminMessages userEmail={user.email} />
        </div>
      );
    }
    
    return (
      <div className="max-w-md mx-auto p-8">
        <div className="bg-white p-8 rounded-lg shadow-md border border-purple-200 text-center">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Welcome, {fullName}!</h1>
          <p className="text-purple-700 mb-6">Email: <span className="font-semibold">{user.email}</span></p>
          <div className="space-y-3">
            <button
              onClick={() => setShowMessages(true)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Contact Messages
            </button>
            <button
              onClick={onLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      {showSignup ? (
        <SignupForm onSignupSuccess={(user) => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(true)} />
      ) : (
        <LoginForm onLogin={onLogin} onSwitchToSignup={() => setShowSignup(true)} />
      )}
    </div>
  );
};

export default Profile;