import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null; 
  }

  return (
    <section className="p-12 bg-primary text-white">
      <div className="container mx-auto mb-16 flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
        <a href='/'>
          <img src="/logo2.png" alt="Logo" className="mb-6" />
          </a>
          <p className="text-white text-center md:text-left w-80">
          Our consultation service is completely free and designed to save you time and effort. Fill out the form above, and one of our AI matchmaking experts will get in touch.

          </p>
        </div>

        <div className="flex flex-col space-y-8">
          <h4 className="text-2xl font-bold">Links</h4>
          <ul className="space-y-4">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/blogs" className="hover:underline">Blogs</a></li>
            <li><a href="/newsletter" className="hover:underline">Newsletter</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-8">
          <h4 className="text-2xl font-bold">Legal</h4>
          <ul className="space-y-4">
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
            <li><a href="/cookie-policy" className="hover:underline">Data Protection</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-8">
          <h4 className="text-2xl font-bold">Contact Details</h4>
          <ul className="space-y-4">
            <li className='font-bold'>Telephone: <a href="tel:+1234567890" className="font-normal hover:underline">+1 234 567 890</a></li>
            <li className='font-bold'>Email: <a href="mailto:info@yourcompany.com" className="font-normal hover:underline">aiagencydirectory@gmail.com</a></li>
            <li className='font-bold'>Address: <span className='font-normal'>1234 Street Name, City, Country</span></li>
            <li className="flex space-x-16 text-2xl">
            <a href="https://facebook.com/yourcompany" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://twitter.com/yourcompany" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://instagram.com/yourcompany" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className='mt-16'>
      <p className="text-center text-white">
      Copyright 2024 AI Agency Directory | All Rights Reserved
          </p>
      </div>
    </section>
  );
};

export default Footer;
