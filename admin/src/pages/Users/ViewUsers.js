import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUserById } from '../../services/firestoreService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../components/common/PageHead';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    getUsers();
  }, []);

  const handleDelete = async (userId) => {
    if(window.confirm('Are you sure you want to delete?')){
    await deleteUserById(userId);
    setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isWithinDateRange = (dateJoined) => {
    const date = dateJoined.toDate();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;

    return true;
  };

  const filteredUsers = users
    .filter(user =>
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === '' || user.role === roleFilter) &&
      isWithinDateRange(user.dateJoined)
    );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
    <PageHead name='All Users' />
    <div className="container mx-auto p-4 max-w-5xl">
      

      <div className="flex flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className='text-xl text-primary hidden sm:block' />
        <select
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <input
          type="date"
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <table className="min-w-full bg-gray-100 table-auto text-left my-10">
        <thead className='text-xl text-secondary'>
          <tr>
            <th className="border border-gray-300 px-4 py-1">Name</th>
            <th className="border border-gray-300 px-4 py-1">Email</th>
            <th className="border border-gray-300 px-4 py-1">Role</th>
            <th className="border border-gray-300 px-4 py-1">Date Joined</th>
            <th className="border border-gray-300 px-4 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-1">{user.username}</td>
                <td className="border border-gray-300 px-4 py-1">{user.email}</td>
                <td className="border border-gray-300 px-4 py-1">{user.role}</td>
                <td className="border border-gray-300 px-4 py-1">{formatDate(user.dateJoined)}</td>
                <td className="border border-gray-300 px-4 py-1">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-4 py-2"
                  >
                    <FontAwesomeIcon icon={faTrash} className='text-red-500' />
                  </button>
                  <button
                    onClick={() => handleEdit(user.id)}
                    className=" px-4 py-2"
                  >
                    <FontAwesomeIcon icon={faPen} className='text-primary' />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No users found</td>
            </tr>
          )}
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

export default ViewUsers;
