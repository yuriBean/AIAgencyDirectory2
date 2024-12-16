import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgency, editAgency } from '../services/firestoreService';
import { uploadImage } from '../utils/uploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../components/Common/PageHead';
import { useAuth } from '../context/AuthContext';

const EditAgency = () => {
  const { agencyId } = useParams(); 
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [logoName, setLogoName] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    industry: '',
    phone: '',
    website: '',
    isApproved: false,
    logo: '',
    rating: 0,
    services: '', 
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
          rating: agencyData.rating || 0,
          services: agencyData.services.join(', '), 
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

    fetchAgency();
  }, [agencyId, currentUser.uid, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData({ ...formData, logo: files[0] });
      setLogoName(files[0]?.name || '');
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
      let logoUrl = agency.logo; 
  
      if (formData.logo instanceof File) {
        const path = `agency_logos/${currentUser.uid}/logos/`;
        logoUrl = await uploadImage(formData.logo, path);
      }

      const servicesArray = formData.services.split(',').map(service => service.trim()).filter(service => service);

      const agencyData = {
        name: formData.name,
        logo: logoUrl,
        description: formData.description,
        services: servicesArray,
        industry: formData.industry,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        rating: formData.rating,
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
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
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-bold mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
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
              <option value="" disabled>Industry</option>
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
          </div>

          <div>
            <label className="block font-bold mb-2">Logo</label>
            <div className="relative w-full">
              <label className="block p-3 border border-gray-600 rounded text-gray-500 cursor-pointer">
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

          <div>
            <label htmlFor="rating" className="block font-bold mb-2">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            >
              {[...Array(6).keys()].map((number) => (
                <option key={number} value={number}>{number}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="services" className="block font-bold mb-2">Services (comma separated)</label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
            />
          </div>

          <div className='flex justify-center items-center'>
            <button type="submit" className='bg-primary text-white p-3 rounded'>
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