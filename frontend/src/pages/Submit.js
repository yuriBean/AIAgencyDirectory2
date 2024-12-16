import PageHead from '../components/Common/PageHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { addAgencyToFirestore, getUser } from '../services/firestoreService';
import { uploadImage } from '../utils/uploadImage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addAgencyNotification } from '../services/firestoreService';

const Submit = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(currentUser.uid);

   if (user.isSubscribed=== false) {
      setLoading(true);
      setTimeout(() => navigate('/payments'), 2000);
    } else {
      setLoading(false);
    }
  }
    fetchUser();
  }, [currentUser, navigate]);
  

  const [formData, setFormData] = useState({
    agencyName: '',
    userId: currentUser.uid,
    logo: null,
    description: '',
    services: [],
    industry: '',
    email: '',
    phone: '',
    website: '',
    rating: 0,
    dateCreated: new Date(),
    testimonials: [],
    pricings: [],
    caseStudies: [],
    isApproved: false,
  });
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [invalid, setInvalid] =useState(false);

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
    } else if (name === 'website') {
      setFormData({ ...formData, website: value });
      setError(''); 
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

      const websiteUrl = formData.website;
      console.log('Website URL to be checked:', websiteUrl);

      const response = await fetch('https://api.aiagencydirectory.com/check-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ websiteUrl }), 
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.exists) {
        setInvalid(true);
        throw new Error('The website does not exist or cannot be reached.');
      }

      let logoUrl = '';

      if (formData.logo && currentUser) {
        const path = `agency_logos/${currentUser.uid}/logos/`;
        logoUrl = await uploadImage(formData.logo, path); 
      }

      const additionalServices = (formData.otherServices || '')
      .split(',')
      .map(service => service.trim())
      .filter(service => service.length > 0);
    
    const servicesArray = [...formData.services, ...additionalServices];

    const agencyData = {
      name: formData.agencyName,
      userId: formData.userId,
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

      const agencyId=await addAgencyToFirestore(agencyData);
      await addAgencyNotification(agencyId, currentUser.uid);
      setError(''); 
      console.log('Agency submitted successfully');
      navigate(`/agency/${agencyId}`);
    } catch (err) {
      if (invalid) {
        setError('Please enter a valid website URL.');
      } else {
        setError('Failed to submit the agency. Please try again.');
      }
      console.error(err);
    } finally {
      setIsUploading(false); 
    }
  };
  return (
    <>
      <PageHead pagename='Submit Your AI Agency' subheading='Are you an AI consulting firm looking to showcase your expertise and connect with businesses seeking AI solutions? Submit your agency to be featured on AI Agency Directory and gain visibility among our growing community of businesses.' />
      <div className='flex items-center justify-center my-16 mx-2'>
        <form className="space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="agencyName"
              placeholder="Agency Name"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
              required
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
            required
          ></textarea>

            <div className='space-y-5'>
            <label className='font-bold text-lg'>Services Offered:</label>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
              {[
                'Workflow Automation and Optimization',
                'Custom App Development',
                'Content Creation and Management',
                'Chatbots',
                'CRM',
                'Data Labeling'
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
              required
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
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
              required
            />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            pattern="[0-9]*"
            inputMode="numeric"
            onChange={handleChange}
            maxLength='13'
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
          />
          </div>
          <input
            type="text"
            name="website"
            placeholder="Website (https://example.com)"
            pattern="https?://.+"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
          />
    
          <div className='mb-32 flex justify-center items-center'>
            <button type="submit" className='bg-primary text-white text-xl md:text-2xl p-5 px-8 md:px-24 hover:bg-blue-600 rounded-full'>
            {isUploading ? 'Submitting...' : 'Submit Your Agency'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}

        </form>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white opacity-90 p-6 py-16 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">Redirecting to Plans</h2>
            <p className="text-lg text-gray-700">You must subscribe to a plan before submitting an agency.</p>
          </div>
        </div>
      )}

    </>
  );
};

export default Submit;