import PageHead from '../components/Common/PageHead';
import React, { useState } from 'react';
import Latest from './Common/Latest'
import { useAuth } from '../context/AuthContext';
import { addConsultation, addConsultationNotification } from '../services/firestoreService';

const Newsletter = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
    await addConsultation({
      ...formData,
      userId: currentUser.uid,
      timestamp: new Date(),
    }); 
    await addConsultationNotification(currentUser.uid);
    setSubmitted(true);
  } catch (err) {
    setError("There was an error submitting the form. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}
    
  return (
    <>
    <PageHead pagename='Newsletter' />
    <div className="max-w-7xl mt-10 mx-auto p-4 sm:p-6 flex flex-col justify-center items-center space-y-16">
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:items-center">
        <div className='my-6 md:my-9 sm:mb-0'>
          <h1 className="text-4xl font-bold text-secondary">Stay Ahead
          with Our Latest AI Insights</h1>
          <p className="text-lg  font-medium mt-2 sm:mt-4"> 
          Stay informed and inspired with our curated selection of articles. Our newsletter delivers the latest trends, success stories, and expert insights directly to your inbox, helping you stay ahead in the ever-evolving world of AI.

          </p>
        </div>
      </div>

      <Latest /> 
      <a href='/blogs'>
      <button className='bg-primary py-2 px-8 sm:py-3 sm:px-11 rounded-full text-white hover:bg-blue-600 sm:text-xl'>
          View All Articles
        </button>
        </a>
    </div>

    <div className="max-w-5xl mt-10 mx-auto p-4 sm:p-6 flex flex-col justify-center items-center space-y-16">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:items-center">
        <div className='mt-6 md:my-9 sm:mb-0 leading-wider space-y-9'>
          <h2 className="text-4xl font-bold text-secondary ">Unlock the Power<br /> 
          of AI with a Free Consultation</h2>
          <p className="text-lg  font-medium mt-2 sm:mt-4"> 
          Stay informed and inspired with our curated selection of articles. Our newsletter delivers the latest trends, success stories, and expert insights directly to your inbox, helping you stay ahead in the ever-evolving world of AI.

          </p>
        </div>
        
      </div>
            </div>
            <div className=' flex items-center justify-center my-16 mx-2 '>

            {submitted ? (
          <div className="text-center p-6 text-primary font-medium">
            Thank you for reaching out! We’ll get back to you soon.
          </div>
        ) : (
            <form className="space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
          <div className="grid gr id-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-grey-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-grey-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-grey-600"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-grey-600"
            />
          </div>

          <textarea
            name="projectDetails"
            placeholder="Tell Us About Your Project Or What Services You're Interested In"
            value={formData.projectDetails}
            onChange={handleChange}
            className="w-full p-3 border bg-transparent border-gray-600 border-2 rounded-xs h-48 focus:outline-none placeholder-grey-600"
          ></textarea>

{error && <p className="text-red-500 text-center">{error}</p>}

            <div className='mb-6 flex justify-center'>
          <button 
          type="submit"
          className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition">
          {isSubmitting ? "Submitting..." : "Get My Free Consultation"}
          </button>
          </div>
        </form> )}
        </div>

    </>
  );
};

export default Newsletter
