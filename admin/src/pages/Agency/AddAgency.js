import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { addAgency, getUsers, getIndustries, getServices } from '../../services/firestoreService';
import { uploadImage } from '../../utils/uploadImage'
import PageHead from '../../components/common/PageHead';

const AddAgency = () => {
  
    const [formData, setFormData] = useState({
      agencyName: '',
      userId: '',
      logo: null,
      description: '',
      services: [],
      industry: '',
      email: '',
      phone: '',
      website: '',
      dateCreated: new Date(),
      testimonials: [''],
      pricings: [''],
      caseStudies: [''],
      isApproved: true,
    });
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [logoName, setLogoName] = useState('');
    const [users, setUsers] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredUsers, setFilteredUsers] = useState([]); 
    const [services, setServices] = useState([]);
    const [industries, setIndustries] = useState([]);
  
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
  
    const handleUserSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(query)));
    };
  
    const handleUserSelect = (userId) => {
      setFormData({ ...formData, userId: userId });
    };

    const handleRemoveLogo = () => {
      setFormData({ ...formData, logo: null });
      setLogoName('');
    };
      
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsUploading(true); 
  
      try {

        if (!formData.userId) {
          setError('Please select a user.');
          setIsUploading(false);
          return;
        }

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
        userId: formData.userId,
        logo: logoUrl,
        description: formData.description,
        services: servicesArray,
        industry: formData.industry,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
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

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const usersList = await getUsers(); 
          setUsers(usersList);
          setFilteredUsers(usersList);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to fetch users. Please try again.');
        }
      };

      const fetchData = async () => {
        const servicesData = await getServices();
        const industriesData = await getIndustries();
        setServices(servicesData);
        setIndustries(industriesData);
      }
    
      fetchData();
      fetchUsers();
    }, []);
      
  return (
    <div className="max-w-full mx-auto">
      <PageHead name='Add Agency' />
      <div className='flex items-center justify-center my-16 mx-2'>
      <form className="space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="space-y-5">
            <label className="font-bold text-lg">Assign User:</label>
            <input
              type="text"
              placeholder="Search User"
              value={searchQuery}
              onChange={handleUserSearch}
              className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
            />
            <ul className="border border-gray-600 rounded-md max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    formData.userId === user.id ? 'bg-blue-100' : ''
                  }`}
                >
                  {user.username}
                </li>
              ))}
            </ul>

            {formData.userId && (
              <p className="text-sm text-gray-600 mt-2">
                Selected user: {users.find(user => user.id === formData.userId)?.username || 'Unknown'}
              </p>
            )}
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
              {industries.map((industry) => (
                <option key={industry.id} value={industry.name}>
                  {industry.name}
                </option>
              ))}
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
