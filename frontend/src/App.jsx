import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowSignup(false);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <>
        {showSignup ? (
          <>
            <Signup onSuccess={handleAuthSuccess} />
            <p className="switch-auth">
              Already have an account? 
              <button onClick={() => setShowSignup(false)}>Login here</button>
            </p>
          </>
        ) : (
          <>
            <Login onSuccess={handleAuthSuccess} onSwitchToSignup={() => setShowSignup(true)} />
          </>
        )}
      </>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
