import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAgencies } from '../services/firestoreService';
import queryString from 'query-string'; 

const SearchResults = () => {
    const location = useLocation();
    const { term = '', service = '', industry = '', matchType } = queryString.parse(location.search); 

    const [agencies, setAgencies] = useState([]);

    useEffect(() => {
        const fetchAgencies = async () => {
            const allAgencies = await getAgencies(); 
            let filteredAgencies;

            if (matchType === 'or') {
                filteredAgencies = allAgencies.filter(agency => 
                    (term && (
                        agency.name?.toLowerCase().includes(term.toLowerCase()) ||
                        agency.description?.toLowerCase().includes(term.toLowerCase())
                    )) ||
                    (service && agency.services.includes(service)) ||
                    (industry && agency.industry === industry)
                );
            } else {
                filteredAgencies = allAgencies.filter(agency => {
                    const matchesSearchTerm = 
                        term.trim() === '' || 
                        (agency.name?.toLowerCase().includes(term.toLowerCase()) || 
                        agency.description?.toLowerCase().includes(term.toLowerCase()));

                    const matchesService = 
                        service === '' || 
                        agency.services.includes(service);

                    const matchesIndustry = 
                        industry === '' || 
                        agency.industry === industry;

                    return matchesSearchTerm && matchesService && matchesIndustry;
                });
            }

            setAgencies(filteredAgencies);
        };

        fetchAgencies();
    }, [term, service, industry, matchType]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-4">Search Results</h2>
            {agencies.length === 0 ? (
                <p className="text-lg">No agencies found matching your criteria.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agencies.map(agency => (
                        <li key={agency.id} className="p-4 bg-gray-200 border border-gray-200 rounded-xl shadow-sm">
                            <div className="flex flex-col md:items-center md:space-x-6">
                                <Link to={`/agency/${agency.id}`}>
                                    <img
                                    loading="lazy"
                                        src={agency.logo || '/placeholder.png'}
                                        alt={agency.name}
                                        className="bg-white w-48 h-48 rounded-full object-contain mb-4 md:mb-0"
                                    />
                                </Link>
                                <div className='flex flex-col justify-between space-y-4'>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{agency.name}</h2>
                                    <div>
                                        <p className="text-gray-600"><span className='font-bold'>Industry:</span> {agency.industry}</p>
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
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
