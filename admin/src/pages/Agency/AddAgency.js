import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { addAgency } from '../../services/firestoreService';
import { uploadImage } from '../../utils/uploadImage'
import PageHead from '../../components/common/PageHead';

const AddAgency = () => {
  
    const [formData, setFormData] = useState({
      agencyName: '',
      logo: null,
      description: '',
      services: [],
      industry: '',
      email: '',
      phone: '',
      website: '',
      rating: 0,
      dateCreated: new Date(),
      testimonials: [''],
      pricings: [''],
      caseStudies: [''],
      isApproved: true,
    });
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [logoName, setLogoName] = useState('');
  
    const handleChange = (e) => {
      const { name, value, files, checked } = e.target;
      if (name === 'logo') {
        setFormData({ ...formData, logo: files[0] });
        setLogoName(files[0]?.name || '');
      } else if (name === 'otherServices') {
        setFormData({ ...formData, [name]: value });
      } else if (name === 'services') {
        setFormData(prevState => {
          const updatedServices = checked
            ? [...prevState.services, value]
            : prevState.services.filter(service => service !== value);
          return { ...prevState, services: updatedServices };
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleRemoveLogo = () => {
      setFormData({ ...formData, logo: null });
      setLogoName('');
    };
      
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsUploading(true); 
  
      try {
        let logoUrl = '';
  
        if (formData.logo) {
          const path = `agency_logos/admin_uploaded_logos/`;
          logoUrl = await uploadImage(formData.logo, path); 
        }
  
        const additionalServices = (formData.otherServices || '')
        .split(',')
        .map(service => service.trim())
        .filter(service => service.length > 0);
      
      const servicesArray = [...formData.services, ...additionalServices];
  
      const agencyData = {
        name: formData.agencyName,
        logo: logoUrl,
        description: formData.description,
        services: servicesArray,
        industry: formData.industry,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        rating: 0,
        dateCreated: new Date(),
        testimonials: formData.testimonials,
        pricings: formData.pricings,
        caseStudies: formData.caseStudies,
        isApproved: formData.isApproved,
        };
  
        await addAgency(agencyData);
        setError(''); 
        console.log('Agency submitted successfully');
      } catch (err) {
        setError('Failed to submit the agency. Please try again.');
        console.error(err);
      } finally {
        setIsUploading(false); 
      }
    };
      
  return (
    <div className="max-w-full mx-auto">
      <PageHead name='Add Agency' />
      <div className='flex items-center justify-center my-16 mx-2'>
      <form className="space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="agencyName"
              placeholder="Agency Name"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
            <div className="relative w-full">
              <label className="block p-3 bg-transparent border border-gray-600 border-2 rounded-xs text-gray-500 focus-within:outline-none cursor-pointer">
                
                {logoName ? (
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faImage} className='text-lg mr-3' />
                    <span className="truncate">{logoName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <>
                  <FontAwesomeIcon icon={faUpload} className='text-lg mr-3' />
                  <span className="placeholder-gray-500">Upload Logo</span>
                  </>
                )}
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <textarea
            name="description"
            placeholder="Tell Us About Your Agency"
            onChange={handleChange}
            className="w-full p-3 border bg-transparent border-gray-600 border-2 rounded-xs h-32 focus:outline-none placeholder-gray-500"
          ></textarea>

            <div className='space-y-5'>
            <label className='font-bold text-lg'>Services Offered:</label>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              {[
                'Workflow Automation, and Optimization',
                'Custom App Development',
                'Content Creation and Management',
                'Chatbots',
                'CRM'
              ].map(service => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    className="form-checkbox h-4 w-4 text-primary"
                    onChange={handleChange}
                  />
                  <span className="text-lg">{service}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              name="otherServices"
              placeholder="Other"
              onChange={handleChange}
              className="w-full md:w-1/3 p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
          </div>
          <div className="relative w-full">
            <select
              name="industry"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none text-gray-500 appearance-none"
            >
              <option value="" disabled selected>Industry</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Finance">Finance</option>
                <option value="Ecommerce">Ecommerce</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Accounting">Accounting</option>
                <option value="Technology">Technology</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Law">Law</option>
                <option value="Education">Education</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
          </div>
          <input
            type="text"
            name="website"
            placeholder="Website"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
          />
              
          <div className='mb-32 flex justify-center items-center'>
            <button type="submit" className='bg-primary text-white text-lg px-5 py-2 hover:bg-blue-600 rounded'>
            {isUploading ? 'Submitting...' : 'Submit Agency'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}

        </form>
            </div>
    </div>
  );
};

export default AddAgency;
