import React, { useState } from 'react';
import { login, forgotPassword } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(''); 
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const[loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async () => {
    try {
      await forgotPassword(forgotPasswordEmail);
      setError("Password reset link sent. Check your email.");
      setShowForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-3 bg-cover bg-center" style={{ backgroundImage: `url('/assets/test2.jpg')` }}>
      <div className="flex items-center justify-center bg-transparent p-8">
        <div className="bg-secondary md:bg-transparent p-8 rounded-lg shadow-none md:shadow-xl md:shadow-primary w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Login</h2>
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
          <div className="flex justify-between mt-4 text-sm">
            <small className="text-white">
              <Link to="/signup" className="text-primary underline hover:text-white">Not registered yet? Signup</Link>
            </small>
            <small
              className="text-primary underline cursor-pointer hover:text-white"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </small>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
            <p className="mb-4 text-center text-gray-600">Enter your email to receive a password reset link.</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={forgotPasswordEmail} 
              onChange={(e) => setForgotPasswordEmail(e.target.value)} 
              required 
              className="w-full p-3 border border-primary rounded-lg mb-4 focus:outline-none"
            />
            <button 
              onClick={handleForgotPasswordRequest} 
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Send Reset Link
            </button>
            <button 
              onClick={() => setShowForgotPassword(false)} 
              className="w-full bg-gray-500 text-white py-3 rounded-lg mt-3 hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
