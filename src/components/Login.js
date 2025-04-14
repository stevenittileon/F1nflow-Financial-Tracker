import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Reuse existing styles

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mock user database (replace with backend API in production)
  const users = {
    'Diya': { id: '1', password: 'pass123' },
    'Steven': { id: '2', password: 'pass456' },
    'Dharenish': { id: '3', password: 'pass789' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users[username];
    if (user && user.password === password) {
      setUser(user.id);
      localStorage.setItem('currentUser', user.id);
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="card login-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: '#ff4444', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;