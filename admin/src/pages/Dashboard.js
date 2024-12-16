import React, { useEffect, useState } from 'react';
import { fetchNotifications, approveAgency, deleteAgency, clearNotification, getAgencies } from '../services/firestoreService';
import NotificationsTable from '../components/Dashboard/NotificationsTable';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import AgencyMetrics from '../components/Dashboard/AgencyMetrics';

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [newAgencies, setNewAgencies] = useState([]);
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
    };
    const getNewAgencies = async () => {
      const agencies = await getAgencies();
      setNewAgencies(agencies);
    };
    getNotifications();
    getNewAgencies();
  }, []);

  const handleApprove = async (agencyId) => {
    await approveAgency(agencyId);
    setAgencies(agencies.map(agency => agency.id === agencyId ? { ...agency, isApproved: true } : agency));
  };

  const handleDelete = async (agencyId) => {
   if(window.confirm('Are you sure you want to delete?')){
    await deleteAgency(agencyId);
    setAgencies(agencies.filter(agency => agency.id !== agencyId));
   }
  };

  const handleClearNotification = async (notificationId) => {
    await clearNotification(notificationId);
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  const filteredAgencies = newAgencies.filter(agency => 
    notifications.some(notification => notification.agencyId === agency.id)
  );

  return (
    <div >
      <NotificationsTable notifications={notifications} onClear={handleClearNotification} />
      <div className="container mx-auto p-4">
      <AgencyMetrics agencies={newAgencies} />

      <h2 className='text-2xl font-bold text-secondary'>Recent Agency Submissions</h2>
      <table className="min-w-full bg-white border border-gray-300 my-5">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Logo</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Rating</th>
            <th className="py-2 px-4 border">Services</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgencies.map((agency) => (
            <tr key={agency.id} className="border-b">
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
                    className="text-green-600 py-1 px-2 rounded hover:bg-green-600 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                )}
                <Link to={`/edit-agency/${agency.id}`}>
                  <button 
                    className="text-primary py-1 px-2 rounded hover:bg-primary hover:text-white"
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
      </div>
    </div>
  );
};

export default Dashboard;
