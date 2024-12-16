import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 bg-cover bg-center" style={{ backgroundImage: `url('/test4.jpg')`}}>
      
      <div className="flex items-center justify-center bg-transparent">
      <div className="bg-gradient-to-r from-[#338ca0] via-white-500 to-blue-100 p-8 shadow-none md:shadow-xl w-full h-full flex flex-col justify-center max-w-sm">
      <h2 className="text-3xl font-bold mb-6 text-secondary text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-3 border border-primary rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 border border-primary rounded-lg focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;