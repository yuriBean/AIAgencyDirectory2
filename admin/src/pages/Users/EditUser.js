import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsers, updateUserById } from '../../services/firestoreService';

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: '', email: '', role: '' });

  useEffect(() => {
    const getUserData = async () => {
      const users = await fetchUsers();
      const user = users.find(user => user.id === userId);
      if (user) {
        setUserData(user);
      }
    };
    getUserData();
  }, [userId]);

  const handleUpdate = async () => {
    await updateUserById(userId, userData);
    navigate('/view-users');
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl my-10">
      <h2 className="text-3xl text-primary text-center font-bold my-10">Edit User</h2>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Role</label>
        <select
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <div className='flex justify-center items-center'>
          <button
        onClick={handleUpdate}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
        >
        Save Changes
      </button>
      </div>
    </div>
  );
};

export default EditUser;
