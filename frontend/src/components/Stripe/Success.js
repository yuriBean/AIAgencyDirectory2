import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { updateUserSubscription } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';

const Success = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const savePayment = async () => {
    try {
      const response = await axios.post('https://api.aiagencydirectory.com/save-payment', {
        session_id: sessionId,
      }, {
        headers: {
          "Content-Type": 'application/json'
        }
      });
      console.log(response.data);
      await updateUserSubscription(currentUser.uid, 'premium');
    } catch (error) {
      console.log('Failed to save payment. Please try again.');
    }
  };

  useEffect(() => {
    if (sessionId) {
      savePayment();
    } 
  }, [sessionId]);

  const handleBackHome = () => {
    navigate('/submit');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">Payment Successful!</h1>
          <p className="mt-4 text-lg">Thank you for your purchase. Your payment was processed successfully.</p>
          
          <button
            onClick={handleBackHome}
            className="mt-8 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-700"
          >
            Submit Your Agency
          </button>
        </div>
      
    </div>
  );
};

export default Success;
