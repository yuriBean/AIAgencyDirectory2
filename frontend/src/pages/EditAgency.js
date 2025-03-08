import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgency, editAgency, getServices, getIndustries } from '../services/firestoreService';
import { uploadImage } from '../utils/uploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../components/Common/PageHead';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const EditAgency = () => {
  const { agencyId } = useParams(); 
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [logoName, setLogoName] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    industry: '',
    phone: '',
    website: '',
    isApproved: false,
    logo: '',
    services: [],
    pricings: [],
    caseStudies: [],
    testimonials: [],
  });

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const agencyData = await getAgency(agencyId);
        setAgency(agencyData);

        if (agencyData.userId !== currentUser.uid) {
          navigate(`/agency/${agencyId}`); 
        } else {
        setFormData({
          name: agencyData.name || '',
          description: agencyData.description || '',
          email: agencyData.email || '',
          industry: agencyData.industry || '',
          phone: agencyData.phone || '',
          website: agencyData.website || '',
          isApproved: agencyData.isApproved || false,
          logo: agencyData.logo || '',
          services: agencyData.services || [], 
          pricings: agencyData.pricings || [],
          caseStudies: agencyData.caseStudies || [],
          testimonials: agencyData.testimonials || [],
        });
        setLogoName(agencyData.logo ? agencyData.logo.split('/').pop() : '');}
      } catch (err) {
        setError('Failed to load agency data');
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      const servicesData = await getServices();
      const industriesData = await getIndustries();
      setServices(servicesData);
      setIndustries(industriesData);
    }
  
    fetchData();
    fetchAgency();
  }, [agencyId, currentUser.uid, navigate]);

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

  const getOtherServices = () => {
    return formData.services.filter(service => 
      !services.some(s => s.name === service)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true); 
    try {
      let logoUrl = agency.logo; 
  
      if (formData.logo instanceof File) {
        const path = `agency_logos/${currentUser.uid}/logos/`;
        logoUrl = await uploadImage(formData.logo, path);
      }

      const additionalServices = (formData.otherServices || '')
        .split(',')
        .map(service => service.trim())
        .filter(service => service.length > 0);
      
      const servicesArray = [...formData.services, ...additionalServices];

      const agencyData = {
        name: formData.name,
        logo: logoUrl,
        description: formData.description,
        services: servicesArray,
        industry: formData.industry,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        isApproved: formData.isApproved,
      };

      await editAgency(agencyId, agencyData);
      navigate(`/agency/${agencyId}`); 
    } catch (err) {
      console.log(err);
      setError('Failed to update agency');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveOtherService = (serviceToRemove) => {
    setFormData({
      ...formData,
      services: formData.services.filter(service => service !== serviceToRemove)
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <Helmet>
      <title>Edit Agency | AI Agency Directory</title>
    </Helmet>
      <PageHead pagename='Edit Agency' />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="name" className="block font-bold mb-2">Agency Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
              />
          </div>

          <div>
            <label htmlFor="description" className="block font-bold mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border bg-transparent border-gray-600 border-2 rounded-xs h-32 focus:outline-none placeholder-gray-500"
              />
          </div>

          <div className='flex justify-between gap-3'>
            <div className='w-full'>
              <label htmlFor="email" className="block font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
            </div>

            <div className='w-full'>
              <label htmlFor="phone" className="block font-bold mb-2">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block font-bold mb-2">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
              />
          </div>

          <div>
          <label htmlFor="industry" className="block font-bold mb-2">Industry</label>
          <select
              name="industry"
              onChange={handleChange}
              value={formData.industry}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none text-gray-500 appearance-none"
            >
               <option value="" disabled selected>Industry</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
        </div>

          <div>
            <label className="block font-bold mb-2">Logo</label>
            <div className="relative w-full">
            <label className="block p-3 border border-gray-600 border-2 rounded-xs focus:outline-none text-gray-500 appearance-none cursor-pointer">
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

          <div className='space-y-2'>
          <label htmlFor="services" className="block font-bold mb-2">Services</label>
          <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
            {services.map(service => (
                <label key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services"
                    value={service.name}
                    checked={formData.services.includes(service.name)}
                    className="form-checkbox h-4 w-4 text-primary"
                    onChange={handleChange}
                  />
                  <span className="text-lg">{service.name}</span>
                </label>
              ))}
            </div>

            <div className='space-y-2'>
            <label htmlFor="otherServices" className="block font-bold mb-2">Other Services</label>
            <ul className="flex flex-wrap gap-2">
              {getOtherServices().map((service, index) => (
                <li className='bg-primary rounded-full p-2 text-white flex items-center' key={index}>
                  {service}
                  <button 
                    type="button"
                    className="ml-2 text-red-600 bg-white rounded-full h-6 w-6"
                    onClick={() => handleRemoveOtherService(service)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

            <input
              type="text"
              name="otherServices"
              placeholder="Add Other Services (separated by commas)"
              onChange={handleChange}
              className="w-full md:w-1/2 p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
        </div>

          <div className='flex justify-center items-center'>
            <button type="submit" className="px-6 py-3 bg-primary text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              {isUploading ? 'Updating...' : 'Update Agency'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default EditAgency;