import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOut, faSignIn } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
  };

  return (
    <nav className="bg-white shadow-lg py-3 sticky top-0 z-40 shadow-xl flex items-center justify-between px-6 sm:px-16 text-lg relative text-secondary">
      <div className="text-xl font-bold">
        <a href='/'>
        <img loading="lazy" src='/logo.png' className='w-40 sm:w-60' alt="Logo" /></a>
      </div>

      <div className="sm:hidden">
        <button onClick={toggleMenu} className=" focus:outline-none">
          {menuOpen ? (
            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
          ) : (
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          )}
        </button>
      </div>

      <div className="hidden sm:flex justify-between items-center space-x-16">
        <ul className="flex space-x-16">
          <li><a href="/agencies" className=" hover:text-primary">Find Agencies</a></li>
          <li><a href="/submit-agency" className=" hover:text-primary">Submit Agency</a></li>
          {currentUser && (
          <li><a href="/dashboard" className=" hover:text-primary">Dashboard</a></li>
        )}
          <li><a href="/about" className=" hover:text-primary">About Us</a></li>
          <li><a href="/newsletter" className=" hover:text-primary">Newsletter</a></li>
          <li><a href="/blogs" className=" hover:text-primary">Blogs</a></li>
        </ul>
        <div className='flex justify-center items-center'>
          {!currentUser ? (
            <button
              onClick={handleSignIn}>
              <FontAwesomeIcon icon={faSignIn} className='text-primary hover:text-white hover:bg-primary p-2 rounded'/>
            </button>
          ) : (
            <button
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOut} className='text-red-600 hover:text-white hover:bg-red-600 p-2 rounded'/>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
          <ul className="flex flex-col space-y-4 p-6">
            <li><a href="/agencies" className=" hover:text-blue-500" onClick={toggleMenu}>Find Agencies</a></li>
            <li><a href="/submit-agency" className=" hover:text-blue-500" onClick={toggleMenu}>Submit Agency</a></li>
            <li><a href="/about" className=" hover:text-blue-500" onClick={toggleMenu}>About Us</a></li>
          {currentUser && (
            <li><a href="/dashboard" className=" hover:text-blue-500" onClick={toggleMenu}>Dashboard</a></li>
          )}
            <li><a href="/newsletter" className=" hover:text-blue-500" onClick={toggleMenu}>Newsletter</a></li>
            <li>
              {!currentUser ? (
                <button className="bg-primary text-white px-8 py-2 rounded-full hover:bg-blue-700 w-full"
                  onClick={() => { handleSignIn(); toggleMenu(); }}>
                  Sign Up
                </button>
              ) : (
                <button
                  onClick={() => { handleLogout(); toggleMenu(); }}
                  className="px-4 py-2 bg-red-500 rounded text-white w-full"
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
