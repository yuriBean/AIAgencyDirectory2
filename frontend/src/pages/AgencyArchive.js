import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgencies } from '../services/firestoreService';
import PageHead from '../components/Common/PageHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faUserShield, faClipboardList, faUsers, faGlobe, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Top from '../components/Common/Top'
import NewsletterSignup from '../utils/NewsletterSignup';

const AgencyArchive = () => {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('name');
  const [sortBy, setSortBy] = useState('latest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =5; 
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const industries = [
    'Marketing & Sales',
    'Finance',
    'Ecommerce',
    'Real Estate',
    'Accounting',
    'Technology',
    'Manufacturing',
    'Law',
    'Education',
  ];

  const services = [
    'Workflow Automation',
    'Custom App Development',
    'Content Creation',
    'Chatbots',
    'CRM',
    'Data Labeling',
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); 
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const fetchedAgencies = await getAgencies();
        setAgencies(fetchedAgencies);
        setFilteredAgencies(fetchedAgencies);
      } catch (err) {
        setError('Failed to fetch agencies.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    const filterAgencies = () => {
      let filtered = agencies;

      if (searchTerm) {
        filtered = filtered.filter(agency => {
          switch (searchOption) {
            case 'name':
              return agency.name.toLowerCase().includes(searchTerm.toLowerCase());
            case 'service':
              return agency.services.some(service =>
                service.toLowerCase().includes(searchTerm.toLowerCase())
              );
            case 'industry':
              return agency.industry.toLowerCase().includes(searchTerm.toLowerCase());
            default:
              return true;
          }
        });
      }

      if (selectedIndustries.length > 0) {
        filtered = filtered.filter(agency => selectedIndustries.includes(agency.industry));
      }

      if (selectedServices.length > 0) {
        filtered = filtered.filter(agency =>
          agency.services.some(service => selectedServices.includes(service))
        );
      }

      if (ratingFilter) {
        filtered = filtered.filter(agency => agency.rating >= parseInt(ratingFilter));
      }

      if (sortBy === 'latest') {
        filtered = filtered.sort((a, b) => b.dateCreated.seconds - a.dateCreated.seconds);
      } else if (sortBy === 'oldest') {
        filtered = filtered.sort((a, b) => a.dateCreated.seconds - b.dateCreated.seconds);
      }

      setFilteredAgencies(filtered);
      setCurrentPage(1);
    };

    filterAgencies();
  }, [searchTerm, searchOption, agencies, sortBy, ratingFilter, selectedIndustries, selectedServices]);

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgencies = filteredAgencies.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleIndustry = (industry) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg text-red-600">{error}</span>
      </div>
    );
  }

  const benefits = [
    {
      icon: faUserShield,
      title: 'Verified Agencies',
      description: 'All agencies are thoroughly vetted.',
    },
    {
      icon: faClipboardList,
      title: 'Detailed Profiles',
      description: 'Comprehensive information on each agency.',
    },
    {
      icon: faUsers,
      title: 'User Reviews',
      description: 'Honest feedback from clients.',
    },
    {
      icon: faGlobe,
      title: 'Wide Range of Services',
      description: 'Agencies specializing in various AI solutions.',
    },
  ];


  return (
    <>
      <PageHead pagename="Discover Leading AI Agencies" subheading="Explore our comprehensive directory of top AI agencies to find the perfect partner for your business needs." />

      <div className="container mx-auto my-3 p-6 shadow-md rounded-lg">
        <div className="max-w-7xl mt-10 mx-auto p-4 sm:p-6">
          <h1 className="text-4xl font-bold text-secondary">Featured Agencies</h1>
        </div>
        <Top />
        <div className='my-12 '>
          <label className='font-bold text-lg text-primary'>Find what you're looking for:</label>
          <div className=" flex  flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none"
            >
              <option value="name">Search by Name</option>
              <option value="service">Search by Service</option>
              <option value="industry">Search by Industry</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchOption}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
            />
            <FontAwesomeIcon icon={faSearch} className='text-xl text-primary hidden sm:block'/>
          </div>

          <div className="my-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-start md:items-center">
            <label className='font-bold text-lg text-primary'>Sort by:</label>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none"
            >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
            </select>

            <label className='font-bold text-lg text-primary ml-0 md:ml-8'>Filter:</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none"
            >
              <option value="">Select Ratings</option>
              {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star}>{'★'} {`${star} stars & up`}</option>    
              ))}
            </select>

        <div className="relative inline-block">
          <button 
            onClick={() => {setShowIndustriesDropdown(!showIndustriesDropdown); setShowServicesDropdown(false);}} 
            className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none flex items-center"
          >
            {selectedIndustries.length > 0 ? `${selectedIndustries.length} Selected` : 'Select Industries'} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </button>
          {showIndustriesDropdown && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {industries.map(industry => (
                <label key={industry} className="flex items-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry)}
                    onChange={() => toggleIndustry(industry)}
                    className="mr-2"
                  />
                  {industry}
                </label>
              ))}
            </div>
          )}
      </div>

        <div className="relative inline-block">
          <button 
            onClick={() => {setShowServicesDropdown(!showServicesDropdown); setShowIndustriesDropdown(false);}} 
            className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none flex items-center"
          >
            {selectedServices.length > 0 ? `${selectedServices.length} Selected` : 'Select Services'} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </button>
          {showServicesDropdown && (
            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {services.map(service => (
                <label key={service} className="flex items-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                    className="mr-2"
                  />
                  {service}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

        </div>      
        <ul className="space-y-6 md:space-y-8 min-h-[400px]">
        {paginatedAgencies
  .filter(agency => agency.isApproved) 
  .filter(agency => {
    return selectedIndustries.length === 0 || selectedIndustries.includes(agency.industry);
  })
  .length === 0 ? ( 
    <p className="text-gray-500 text-center">No industries to show</p>
  ) : (
    paginatedAgencies
      .filter(agency => agency.isApproved)
      .filter(agency => {
        return selectedIndustries.length === 0 || selectedIndustries.includes(agency.industry);
      })
      .map(agency => (
        <li key={agency.id} className="p-4 bg-gray-200 border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <Link to={`/agency/${agency.id}`}>
              <img
                src={agency.logo || '/placeholder.jpg'}
                alt={agency.name}
                className="bg-gray-300 w-full h-auto rounded-full object-cover mb-4 md:mb-0 mx-auto"
                />
            </Link>
            <div className='flex flex-col justify-between space-y-4'>
            <Link to={`/agency/${agency.id}`}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{agency.name}</h2> </Link>
              <div>
                <p className="text-gray-600"><span className='font-bold'>Industry:</span> {agency.industry}</p>
                <p className="text-gray-600"><span className='font-bold'>Rating:</span> {agency.rating}</p>
                <p className="text-gray-600"><span className='font-bold'>Created on:</span> {new Date(agency.dateCreated.seconds * 1000).toLocaleDateString()}</p>
              </div>
              <p className="text-gray-700">{agency.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {agency.services.map((service, index) => (
              <span key={index} className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {service}
              </span>
            ))}
          </div>
        </li>
      ))
  )}

</ul>
        <div className="flex justify-center items-center mt-6 space-x-9">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <NewsletterSignup />
      <div className="bg-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary mb-12">Why Choose Our AI Agency Directory?</h2>
        <p className="text-xl text-gray-700 mb-16">We provide a curated list of top AI agencies, verified reviews, and detailed profiles to help you find the perfect AI partner.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-semibold">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-8 rounded-lg shadow-lg shadow-secondary flex flex-col items-center space-y-2">
              <div className='bg-primary p-5 rounded-full flex items-center justify-center w-16 h-16'>
              <FontAwesomeIcon icon={benefit.icon} className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl text-secondary font-bold mb-4">{benefit.title}</h3>
              <p className=''>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Frequently Asked Questions (FAQs)</h2>

        <div className="space-y-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAnswer(0)}>
              <h3 className="text-lg font-semibold text-secondary">How do I find the right AI agency for my business?</h3>
              <FontAwesomeIcon icon={activeIndex === 0 ? faChevronUp : faChevronDown} className="text-primary" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === 0 ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <p className="mt-4 text-gray-600">
                Use our search and filter options to narrow down your choices based on location, services, industry specialization, and ratings.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAnswer(1)}>
              <h3 className="text-lg font-semibold text-secondary">How are the agencies verified?</h3>
              <FontAwesomeIcon icon={activeIndex === 1 ? faChevronUp : faChevronDown} className="text-primary" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === 1 ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <p className="mt-4 text-gray-600">
                All agencies undergo a thorough vetting process to ensure they meet our quality standards.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAnswer(2)}>
              <h3 className="text-lg font-semibold text-secondary">What services do AI agencies typically offer?</h3>
              <FontAwesomeIcon icon={activeIndex === 2 ? faChevronUp : faChevronDown} className="text-primary" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === 2 ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <p className="mt-4 text-gray-600">
                AI agencies often provide services such as Workflow Automation, Data Labeling, Chatbots, and AI strategy consulting.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAnswer(3)}>
              <h3 className="text-lg font-semibold text-secondary">What is an AI agency?</h3>
              <FontAwesomeIcon icon={activeIndex === 3 ? faChevronUp : faChevronDown} className="text-primary" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === 3 ? 'max-h-screen' : 'max-h-0'
              }`}
            >
              <p className="mt-4 text-gray-600">
                An AI agency is a company that provides artificial intelligence solutions, services, or consultancy to help businesses automate processes, analyze data, or implement AI-driven technologies. They often specialize in machine learning, natural language processing, and AI-powered automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default AgencyArchive;
