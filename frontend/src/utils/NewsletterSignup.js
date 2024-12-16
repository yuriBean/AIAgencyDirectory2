import React, { useState } from 'react';
import { saveNewsletterEmail } from '../services/firestoreService'; 

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter a valid email.');
      return;
    }

    try {
      await saveNewsletterEmail(email);
      setSuccess('Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className='relative min-h-80 flex flex-col text-center items-center justify-center py-16 px-4 sm:px-4 bg-center bg-cover' style={{ backgroundImage: 'url("/assets/consul.png")' }}>
      <div className="absolute inset-0 bg-primary opacity-80"></div>
      
      <div className='text-center text-white space-y-9 w-full md:w-2/3 z-10'>
        <h2 className="text-4xl font-bold">
          Don’t miss out on the latest AI insights. Subscribe to our newsletter for regular updates.
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 text-grey-600 flex flex-col justify-center items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Here"
            className="w-2/3 md:w-1/2 p-3 bg-transparent border border-white rounded-md focus:outline-none placeholder-white"
          />
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-200">{success}</p>}
          <button
            type='submit'
            className="px-7 font-medium text-xl bg-white text-primary py-3 border border-2 border-transparent rounded-full hover:bg-primary hover:text-white hover:border-white transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
