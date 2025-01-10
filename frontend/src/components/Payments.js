import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import PageHead from './Common/PageHead';
import { updateUserSubscription } from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getUserSubscriptionStatus } from '../services/firestoreService';

const Payments = () => {
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { currentUser } = useAuth();
    const [ currentPlan, setCurrentPlan ] = useState('');

    useEffect(() => {
      const fetchSubscriptionStatus = async () => {
        if (currentUser) {
          const plan = await getUserSubscriptionStatus(currentUser.uid);
          setCurrentPlan(plan);
        }
      };
      fetchSubscriptionStatus();
    }, [currentUser]);
  
    const handleBasicPlanSelection = async () => {
      if (currentPlan === 'basic') {
        alert('You are already subscribed to the Basic plan.');
        return;
      }
      const userId = currentUser.uid;
      await updateUserSubscription(userId, 'basic');
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate('/submit');
      }, 3000);
      };     

      
    const handlePayment = async(pkg, duration) =>{
      console.log(pkg, duration)
      if (currentPlan === pkg.toLowerCase()) {
        alert(`You are already subscribed to the ${pkg} plan.`);
        return;
      }
      const response = await axios ({
        method: 'post',
        url: 'https://api.aiagencydirectory.com/create-subscription',
        data: {
          plan_name: pkg,
          duration: duration
        },
        headers: {
          "Content-Type": 'application/json'
        }
      })

      if (response.data){
        window.location.href = response.data?.session?.url;
      }
    }
  return (
    <div>
        <PageHead pagename='Choose The Perfect Plan To Start' subheading='Buy a plan to submit your agency and reach more customers!' />
            <div className='my-3 md:my-16'>
                <h2 className='text-secondary font-bold text-4xl text-center'>Available Plans</h2>
            <div className='flex flex-col md:flex-row mx-0 md:mx-32 justify-center gap-9'>
            <div className="shadow-xl bg-gray-100 rounded-lg flex flex-col space-y-9 justify-start my-4 md:my-16 p-12 w-full md:w-1/3 min-w-1/3">
                <div>
                <h3 className='text-2xl font-bold'>Basic</h3>
                <p className='text-gray-600 text-lg'>Best for personal use</p>
                </div>
                <p><span className='mr-2 text-5xl font-bold text-black'>$0</span>/month</p>
              <button 
                onClick={handleBasicPlanSelection}
                className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
                disabled={currentPlan === 'basic' || currentPlan === 'premium'}
              >

              {currentPlan === 'premium' ? 'Already Purchased' : currentPlan === 'basic' ? 'Already Purchased' : 'Get Started'}
              </button>

              <div className='space-y-4'>
                <h4 className='text-xl font-medium'>What You Get:</h4>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Free Profile</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Standard visibility</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Service tags: Limit of 3 tags</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Basic Visibility Insights</p>

              </div>
              </div>

              <div className="shadow-xl bg-gray-100 rounded-lg flex flex-col space-y-9 justify-start my-4 md:my-16 p-12 w-full md:w-1/3 min-w-1/3">
              <div><h3 className='text-2xl font-bold'>Premium</h3>
                <p className='text-gray-600 text-lg'>Best for organizational use</p>
                </div>
                <p><span className='mr-2 text-5xl font-bold text-black'>$50</span></p>
              <button 
                onClick={() => handlePayment('Premium', 'month')}
                className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
                disabled={currentPlan === 'premium'}
              >
              {currentPlan === 'premium' ? 'Already Purchased' : currentPlan === 'basic' ? 'Upgrade to Premium' : 'Get Started'}
              </button>

              <div className='space-y-4'>
                <h4 className='text-xl font-medium'>What You Get:</h4>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Priority ranking</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Service Tags: Unlimited</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Advanced insights</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Priority access to qualified leads</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Newsletter inclusion</p>
                <p className='flex justify-start gap-3 items-center text-lg'><FontAwesomeIcon icon={faCheck} className=' text-primary'></FontAwesomeIcon>Verified pro</p>
              </div>
              </div>
            </div>
          </div>
          {showSuccessMessage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white opacity-90 p-6 py-16 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">Success!</h2>
            <p className="text-lg text-gray-700">You are being redirected.</p>
          </div>
        </div>
      )}
</div>  
          )
}

export default Payments
