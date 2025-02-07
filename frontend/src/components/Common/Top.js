import React, { useEffect, useState } from 'react';
import { getAgencies } from '../../services/firestoreService';
import { Link } from 'react-router-dom';

const TopRatedAgencies = () => {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const fetchAgencies = async () => {
      const data = await getAgencies();
      const featuredAgencies = data.filter(
        (agency) => agency.isFeatured && agency.isApproved
      );

      if (featuredAgencies.length === 0) {
        const approvedAgencies = data.filter((agency) => agency.isApproved);
        const randomAgencies = [];
        while (randomAgencies.length < 6 && approvedAgencies.length > 0) {
          const randomAgency = approvedAgencies[Math.floor(Math.random() * approvedAgencies.length)];
          if (!randomAgencies.includes(randomAgency)) {
            randomAgencies.push(randomAgency);
          }
        }
        setAgencies(randomAgencies); 
      } else {
        setAgencies(featuredAgencies); 
      }
    };
    fetchAgencies();
  }, []);

  const truncateText = (text, limit) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > limit
      ? words.slice(0, limit).join(' ') + '...'
      : text;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6">
        {agencies.map((agency) => (
          <div
            key={agency.id}
            className="bg-white shadow-lg p-4 sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="py-[20%] sm:py-[20%] bg-gray-300 flex items-center justify-center rounded-lg">
                <img
                loading="lazy"
                  src={agency.logo || '/placeholder.png'}
                  alt={agency.name}
                  className="w-48 h-48 object-contain rounded-full bg-white"
                />
              </div>
              <div className="flex items-start justify-between mt-2 mb-4 space-x-4 sm:space-x-10">
                <h2 className="text-xl sm:text-3xl font-bold text-secondary">
                  {agency.name}
                </h2>
              </div>
              <div className="flex flex-wrap justify-start gap-2 mb-4">
                {agency.services &&
                  agency.services.map((service, i) => (
                    <span
                      key={i}
                      className="border border-primary text-primary text-xs px-2 sm:px-3 py-1 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {truncateText(agency.description, 30)}
              </p>
            </div>
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
