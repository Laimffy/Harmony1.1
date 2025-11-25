import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import AdminMessages from './components/AdminMessages';
import type { AppView, User } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for token in local storage on initial load
    const storedToken = localStorage.getItem('harmony-token');
    const storedUser = localStorage.getItem('harmony-user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (newToken: string, newUser: User) => {
    localStorage.setItem('harmony-token', newToken);
    localStorage.setItem('harmony-user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setCurrentView('profile'); // Switch to profile view on successful login
  };

  const handleLogout = () => {
    localStorage.removeItem('harmony-token');
    localStorage.removeItem('harmony-user');
    setToken(null);
    setUser(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'services':
        return <Services />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'profile':
        return <Profile user={user} onLogin={handleLogin} onLogout={handleLogout} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">
      <Header currentView={currentView} setCurrentView={setCurrentView} user={user} />
      <main>
        {renderView()}
      </main>
      <footer className="text-center p-4 text-sm text-purple-500">
        <p>&copy; {new Date().getFullYear()} Harmony App. Created for Batangas State University.</p>
      </footer>
    </div>
  );
};

export default App;