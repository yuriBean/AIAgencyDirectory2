import React from 'react'
import PageHead from './Common/PageHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsClapping, faShield, faSun } from '@fortawesome/free-solid-svg-icons';

const Company = () => {
  return (
    <div>
      <PageHead pagename='The Company' />
      <div className='flex flex-col md:flex-row items-start justify-between p-4 md:p-32 mx-4 md:mx-16'>
        <h1 className='w-full md:w-1/3 text-secondary text-2xl md:text-3xl font-bold mb-4 md:mb-0'>
          About AI Agency <br /> Directory
        </h1>
        <p className='w-full md:w-2/3 text-base md:text-lg'>
          At AI Agency Directory, we are passionate about connecting businesses with the best AI solutions to drive growth and innovation. Our mission is to serve as a trusted resource in the AI industry, providing businesses with access to top-rated AI agencies and valuable insights to help them thrive in the digital age.
        </p>
      </div>
      <div className='flex items-center justify-center mb-32'>
        <img loading="lazy" src='./assets/comp1.png' />
      </div>
      <div className='flex flex-col md:flex-row items-center justify-between p-4 md:p-32 mx-4 md:mx-16'>
        <div className='space-y-5 w-full md:w-2/3'>
        <h1 className='text-secondary text-2xl md:text-3xl font-bold mb-4 md:mb-0'>
        Our Vision
        </h1>
        <p className='text-base md:text-lg'>
        We envision a future where businesses of all sizes can harness the power of AI to solve complex challenges, improve efficiency, and create meaningful impact in their industries. Through our platform, we aim to democratize access to AI expertise and empower businesses to unlock their full potential.
        </p>
        </div>
        <div className='w-full md:w-1/3'>
        <img loading="lazy" src='./assets/comp2.png' />
        </div>
      </div>
      
<div className='p-8 md:p-32 font-medium'>
  <h1 className='text-3xl md:text-5xl font-bold text-secondary text-center my-8 md:my-16'>Our Values</h1>
  <div className='flex flex-col md:flex-row justify-between items-end space-y-12 md:space-y-19 md:space-x-16'>
    <div className='flex flex-col space-y-4 items-center md:items-start text-center md:text-left'>
      <div className='bg-primary p-5 rounded-full flex items-center justify-center w-16 h-16'>
        <FontAwesomeIcon icon={faHandsClapping} className="text-white text-4xl" />
      </div>
      <h2 className='text-secondary text-2xl md:text-3xl font-bold'>Excellence</h2>
      <p>We are committed to excellence in everything we do, from curating top-tier AI agencies to delivering exceptional service to our clients.</p>
    </div>
    
    <hr className="border-l border-primary h-32 md:h-64 mx-4 hidden md:block" />

    <div className='flex flex-col space-y-4 items-center md:items-start text-center md:text-left'>
      <div className='bg-primary p-5 rounded-full flex items-center justify-center w-16 h-16'>
        <FontAwesomeIcon icon={faSun} className="text-white text-4xl" />
      </div>
      <h2 className='text-secondary text-2xl md:text-3xl font-bold'>Innovation</h2>
      <p>We embrace innovation and continuously seek new ways to leverage AI technology for the benefit of our users and partners.</p>
    </div>
    
    <hr className="border-l border-primary h-32 md:h-64 mx-4 hidden md:block" />

    <div className='flex flex-col space-y-4 items-center md:items-start text-center md:text-left'>
      <div className='bg-primary p-5 rounded-full flex items-center justify-center w-16 h-16'>
        <FontAwesomeIcon icon={faShield} className="text-white text-4xl" />
      </div>
      <h2 className='text-secondary text-2xl md:text-3xl font-bold'>Integrity</h2>
      <p>We operate with integrity and transparency, building trust with our clients, partners, and stakeholders through honesty and accountability.</p>
    </div>
  </div>
</div>

<div className='flex flex-col justify-between items-center font-medium space-y-12 p-8 md:p-32 mb-16 w-full'>
  <h2 className='font-bold text-secondary text-3xl md:text-5xl '>Our Team</h2>
  <p className='w-full md:w-2/3 text-center'>
  Meet the dedicated professionals behind AI Agency Directory who are passionate about helping businesses succeed in the AI landscape. From AI experts to customer support specialists, our team is here to support you every step of the way.
  </p>
  <a href='/contact'>
  <button className='bg-primary text-white text-lg p-4 px-16 hover:bg-blue-700 rounded-full'>
    Contact Us
  </button>
  </a>
</div>
    </div>
  )
}

export default Company
