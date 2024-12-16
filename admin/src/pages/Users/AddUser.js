import React, { useState } from 'react';
import { addUser } from '../../services/firestoreService'; 
import { sendInviteEmail } from '../../services/emailService'; 
import PageHead from '../../components/common/PageHead';

const generateRandomPassword = (length = 8) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

const AddUser = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const password = generateRandomPassword(); 

    try {
      await addUser(formData.email, password, formData.name); 
      await sendInviteEmail(formData.email, password); 
      setSuccess('User invited successfully!');
      setFormData({ name: '', email: '' }); 
    } catch (error) {
      setError('Failed to invite user. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHead name='Invite New User' />
      <div className="container max-w-5xl mx-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className='flex justify-center items-center'>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
              disabled={loading}
            >
              {loading ? 'Inviting...' : 'Invite User'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
