import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgencies, getServices, getIndustries } from '../services/firestoreService';
import PageHead from '../components/Common/PageHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faUserShield, faClipboardList, faUsers, faGlobe, faChevronUp, faStar } from '@fortawesome/free-solid-svg-icons';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =5; 
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);

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

      if (sortBy === 'latest') {
        filtered = filtered.sort((a, b) => b.dateCreated.seconds - a.dateCreated.seconds);
      } else if (sortBy === 'oldest') {
        filtered = filtered.sort((a, b) => a.dateCreated.seconds - b.dateCreated.seconds);
      }

      const fetchData = async () => {
        const servicesData = await getServices();
        const industriesData = await getIndustries();
        setServices(servicesData);
        setIndustries(industriesData);
      }
    
      fetchData();
      setFilteredAgencies(filtered);
      setCurrentPage(1);
    };

    filterAgencies();
  }, [searchTerm, searchOption, agencies, sortBy, selectedIndustries, selectedServices]);

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
        <div className="max-w-7xl mt-5 mx-auto p-2">
          <h1 className="text-4xl font-bold text-secondary">Featured Agencies</h1>
        </div>
        <Top label="featured" />
        <div className='my-12 '>
          <label className='font-bold text-2xl text-primary'>Find what you're looking for:</label>
          <div className=" flex flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
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
                <label key={industry.id} className="flex items-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry.name)}
                    onChange={() => toggleIndustry(industry.name)}
                    className="mr-2"
                  />
                  {industry.name}
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
                <label key={service.id} className="flex items-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => toggleService(service.name)}
                    className="mr-2"
                  />
                  {service.name}
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
                  <div className="grid w-full grid-cols-1 md:grid-cols-4 md:items-center md:space-x-6">
                    <div className='col-span-1 bg-gray-300 p-4 flex items-center justify-center rounded-lg'>
                    <Link to={`/agency/${agency.id}`}>
                    <img
                    loading="lazy"
                        src={agency.logo || '/placeholder.png'}
                        alt={agency.name}
                        className="w-48 h-48 object-contain rounded-full bg-white"
                      />
                    </Link>
                    </div>
                    <div className='col-span-3'>
                    <div className='flex flex-col justify-between space-y-4'>
                    <Link to={`/agency/${agency.id}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{agency.name}</h2> </Link>
                      <div>
                        <p className="text-gray-600"><span className='font-bold'>Industry:</span> {agency.industry}</p>
                        <p className="text-gray-600"><span className='font-bold'>Created on:</span> {new Date(agency.dateCreated.seconds * 1000).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-700">{agency.description.length > 300 ? agency.description.slice(0, 300) + "..." : agency.description}</p>
                      <span className='text-primary m-0 font-bold'><a href={`/agency/${agency.id}`}>Check Out</a></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {agency.services.map((service, index) => (
                      <span key={index} className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
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
      <div className="bg-white py-16 px-6">
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
                Use our search and filter options to narrow down your choices based on location, services, and industry specialization.
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
