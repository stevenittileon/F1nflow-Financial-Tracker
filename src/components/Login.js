import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const navigate = useNavigate();

  // Load existing users from localStorage or initialize with mock data
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : {
      'Diya': { id: '1', password: 'pass123' },
      'Steven': { id: '2', password: 'pass456' },
      'Dharenish': { id: '3', password: 'pass789' },
    };
  });

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

  const handleRegister = (e) => {
    e.preventDefault();
    if (users[username]) {
      setError('Username already exists');
      return;
    }
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    const newUserId = String(Object.keys(users).length + 1);
    const newUsers = {
      ...users,
      [username]: { id: newUserId, password: password }
    };
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    setError('User created successfully! You can now log in.');
    setIsRegistering(false); // Switch back to login mode after registration
  };

  return (
    <div className="card login-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>{isRegistering ? 'Create User' : 'Login'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
        <button type="submit">{isRegistering ? 'Create User' : 'Login'}</button>
        {error && <p style={{ color: '#ff4444', marginTop: '10px' }}>{error}</p>}
      </form>
      <p style={{ marginTop: '15px', color: '#ffffff' }}>
        {isRegistering ? (
          <span onClick={() => { setIsRegistering(false); setError(''); }} style={{ cursor: 'pointer', color: '#1a73e8' }}>Back to Login</span>
        ) : (
          <span onClick={() => { setIsRegistering(true); setError(''); }} style={{ cursor: 'pointer', color: '#1a73e8' }}>Create New User</span>
        )}
      </p>
    </div>
  );
};

export default Login;
