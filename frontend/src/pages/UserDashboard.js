import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserAgencies, updateUsername, updatePassword, deleteAgency } from '../services/firestoreService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../components/Common/PageHead';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const [agencies, setAgencies] = useState([]);
    const [username, setUsername] = useState(currentUser.username || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getAgencies = async () => {
            const agenciesList = await fetchUserAgencies(currentUser.uid);
            setAgencies(agenciesList || []);;
        };

        getAgencies();
    }, [currentUser]);

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        try {
            await updateUsername(currentUser.uid, username);
            setSuccess('Username updated successfully!');
            setUsername('');
        } catch (err) {
            setError('Failed to update username. Please try again.');
        } finally {
            setError('');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await updatePassword(currentUser, password);
            setPassword('');
            setSuccess('Password updated successfully!');
        } catch (err) {
            setError('Failed to update password. Please try again.');
        }
    };

    const handleDelete = async (agencyId) => {
        if (window.confirm('Are you sure you want to delete this agency?')) {
            await deleteAgency(agencyId);
        }
    };

    const handleEdit = (agencyId) => {
        navigate(`/edit-agency/${agencyId}`);
    };

    return (
        <>
        <Helmet>
            <title>Dashboard | AI Agency Directory</title>
            <meta name='description' 
               content='Manage your AI agency profile, track submissions, and access exclusive insights with AI Agency Directory. Take control and grow your reach today!' />
        </Helmet>
        <PageHead pagename='Dashboard' />

        <div className="p-6 max-w-full md:max-w-7xl mx-auto">

        <div className="bg-blue-100 border border-primary text-secondary px-4 py-3 rounded-lg mb-6 flex items-start justify-between">
        <div>
            <p className="font-semibold text-lg">Upgrade to Premium</p>
            <p className="text-sm">Enhance your reach and unlock exclusive features.</p>
        </div>
        <button
            onClick={() => navigate('/payments')}
            className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
            Upgrade Now
        </button>
    </div>
            <div className="bg-white shadow-md rounded-lg p-0 md:p-6 mb-8">
                <h2 className="text-4xl text-secondary font-bold mb-4 my-5">Your Agencies</h2>

                {agencies.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>You currently have no agencies. Create one to get started!</p>
                        
                        <a href='/submit-agency'>
                        <button
                            className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Create New Agency
                        </button>
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {agencies.map((agency) => (
                            <div key={agency.id} className="bg-gray-50 p-4 rounded-lg shadow flex flex-col space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-semibold text-primary">
                                        <a href={`/agency/${agency.id}`}>
                                        {agency.name}
                                        </a>
                                    </h3>
                                    <div className="space-x-2">
                                        <button 
                                            onClick={() => handleEdit(agency.id)} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(agency.id)} 
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                                {agency.isApproved === false && (
                                    <p className="text-red-500 font-semibold">Under Approval</p>
                                )}
                                <div className="flex flex-col space-y-2">
                                    <img
                                    loading="lazy"
                                        src={agency.logo || '/placeholder.png'}
                                        alt={agency.name}
                                        className="w-40 h-40 object-cover rounded-lg mx-auto"
                                    />
                                    <p className="text-gray-600">
                                        <strong>Industry:</strong> {agency.industry}
                                    </p>
                                   
                                    <p className="text-gray-600">
                                        <strong>Date Created:</strong> {new Date(agency.dateCreated.seconds * 1000).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Contact:</strong> {agency.email}, {agency.phone}
                                    </p>
                                    <p className="text-gray-700">
                                        {agency.description}
                                    </p>

                                    <a
                                        href={agency.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-center hover:bg-blue-700 transition-colors"
                                    >
                                        Visit Website
                                    </a>
                                </div>

                                <div className="mt-4">
                                {agency.services.length > 0 && (
                                    <>
                                    <h4 className="text-lg font-semibold">Services Offered</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {agency.services.map((service, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                    </>)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-200 shadow-md rounded-xl my-4 p-6 text-secondary">
                <h2 className="text-4xl font-bold mb-4">Update Account</h2>
                
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}

                <form onSubmit={handleUsernameChange} className="mb-6">
                    <div className="flex flex-col mb-4">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="New Username"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full md:w-1/2 focus:outline-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Update Username
                    </button>
                </form>

                <form onSubmit={handlePasswordChange}>
                    <div className="flex flex-col mb-4">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full md:w-1/2 focus:outline-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default UserDashboard;
