import React, { useEffect, useState } from 'react';
import { getAgencies } from '../../services/firestoreService';
import { Link } from 'react-router-dom';

const TopRatedAgencies = () => {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      const data = await getAgencies(); 
      const topRated = data.filter(agency => agency.rating >= 0 && agency.isApproved); 
      setAgencies(topRated);
    };
    fetchAgencies();
  }, []);

  const truncateText = (text, limit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6">
        {agencies.map((agency, index) => (
          
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col"
          >
            <div className='py-[30%] sm:py-[20%] bg-gray-200 flex items-center justify-center'>
              <img
                src={agency.logo}
                alt={agency.name}
                className="h-12 sm:h-36 object-cover"
              />
            </div>
            <div className="flex items-end justify-between mt-2 mb-4 space-x-4 sm:space-x-10">
              <h2 className="text-xl sm:text-3xl font-bold text-secondary">{agency.name}</h2>
              <span className="text-yellow-500 text-base sm:text-xl font-bold">{agency.rating}★</span>
            </div>
            <div className="flex flex-wrap justify-start gap-2 mb-4">
              {agency.services && agency.services.map((service, i) => (
                <span
                  key={i}
                  className="border border-primary text-primary text-xs px-2 sm:px-3 py-1 rounded-full"
                >
                  {service}
                </span>
              )
              )}
            </div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{truncateText(agency.description, 30)}</p>
            <div>
            <Link to={`/agency/${agency.id}`}>
              <button className="mt-auto border border-primary text-primary py-2 px-4 sm:px-5 rounded-full hover:bg-primary hover:text-white">
                View Profile
              </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedAgencies;
