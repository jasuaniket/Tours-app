import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = 'http://localhost:3000/api/auth'; // Adjust API URL based on your backend setup
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password
      });
      console.log('Login Success:', response.data);
      login(response.data.token, response.data.user); // Save the token and user data, set authenticated state
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Login Error:', error);
      setError('Invalid credentials. Please try again.'); // Set error message
      setUsername(''); // Reset username field
      setPassword(''); // Reset password field
    }
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, contain a capital letter, a number, and a special character.');
      return;
    }
    
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        email,
        password
      });
      console.log('Register Success:', response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      setError(''); // Clear any previous error message
      // Optionally, show a success message or redirect user
    } catch (error) {
      console.error('Register Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        const message = error.response.data.message;
        if (message.includes('username')) {
          setError('Username already exists. Please choose a different username.');
        } else if (message.includes('email')) {
          setError('Email already exists. Please use a different email.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message
    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <p>{isRegistering ? 'Already have an account?' : 'Don\'t have an account?'} <span onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? 'Login' : 'Register'}</span></p>
    </div>
  );
};

export default Login;
