import React, { useEffect, useState } from 'react';
import { getAgencies, approveAgency, deleteAgency } from '../../services/firestoreService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../../components/common/PageHead';

const ViewAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(''); 
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAgencies = async () => {
      const data = await getAgencies();
      setAgencies(data);
    };
    fetchAgencies();
  }, []);

  const handleApprove = async (agencyId) => {
    await approveAgency(agencyId);
    setAgencies(agencies.map(agency => agency.id === agencyId ? { ...agency, approved: true } : agency));
  };

  const handleDelete = async (agencyId) => {
    if(window.confirm('Are you sure you want to delete?')){
    await deleteAgency(agencyId);
    setAgencies(agencies.filter(agency => agency.id !== agencyId));
    }
  };

  const filteredAgencies = agencies
    .filter(agency => 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agency => 
      approvalStatus === '' || (approvalStatus === 'Approved' && agency.isApproved) || (approvalStatus === 'Pending' && !agency.isApproved)
    )
    .filter(agency => 
      categoryFilter === '' || agency.category === categoryFilter
    )
    .filter(agency => {
      if (startDate && endDate) {
        const agencyDate = agency.dateCreated.toDate();
        return agencyDate >= new Date(startDate) && agencyDate <= new Date(endDate);
      }
      return true;
    });

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const indexOfLastAgency = currentPage * itemsPerPage;
  const indexOfFirstAgency = indexOfLastAgency - itemsPerPage;
  const currentAgencies = filteredAgencies.slice(indexOfFirstAgency, indexOfLastAgency);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
    <PageHead name='Agency Management' />
    <div className="container mx-auto p-4 ">
      
      <div className="flex flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
        <input
          type="text"
          placeholder="Search by name"
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
                <FontAwesomeIcon icon={faSearch} className="text-xl text-primary hidden sm:block" />
        <select
          className="w-full md:w-48 px-4 py-2 border border-primary rounded-md"
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          className="w-full md:w-48 px-4 py-2 border border-primary rounded-md"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Technology">Technology</option>
        </select>
       
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
        <div>
          <label>From</label>
       
          <input
            type="date"
            className="w-full px-4 py-2 border border-primary rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
           </div>
           <div>
          <label>To</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-primary rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
</div>
        </div>
      <table className="min-w-full bg-white border border-gray-300 my-10">
        <thead>
          <tr className="bg-gray-200">
          <th className="py-2 px-4 border">#</th>
            <th className="py-2 px-4 border">Logo</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Rating</th>
            <th className="py-2 px-4 border">Services</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAgencies.map((agency, index) => (
            <tr key={agency.id} className="border-b">
            <td className="py-2 px-4 border text-center text-sm">{indexOfFirstAgency + index + 1}</td>
              <td className="py-2 px-4 border">
                <img src={agency.logo} alt={agency.name} className="h-12 object-cover" />
              </td>
              <td className="py-2 px-4 border text-secondary">{agency.name}</td>
              <td className="py-2 px-4 border text-yellow-500">{agency.rating}★</td>
              <td className="py-2 px-4 border">
                {agency.services && agency.services.map((service, i) => (
                  <span key={i} className="border border-primary text-primary text-xs px-2 py-1 rounded-full">
                    {service}
                  </span>
                ))}
              </td>
              <td className="py-2 px-4 border text-gray-600">{agency.description}</td>
              <td className="py-2 px-4 border flex justify-end">
                {!agency.isApproved && (
                  <button
                    onClick={() => handleApprove(agency.id)}
                    className=" text-green-600 py-1 px-2 rounded hover:bg-green-600 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
                <Link to={`/edit-agency/${agency.id}`}>
                  <button 
                    className=" text-primary py-1 px-2 rounded hover:bg-primary hover:text-white"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(agency.id)}
                  className="text-red-500 py-1 px-2 rounded hover:bg-red-500 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 py-1 px-3 font-bold rounded ${currentPage === index + 1 ? 'underline text-secondary' : 'text-primary'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default ViewAgencies;
