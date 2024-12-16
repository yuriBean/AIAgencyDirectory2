import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isArticlesOpen, setIsArticlesOpen] = useState(false);
    const [isAgenciesOpen, setIsAgenciesOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleArticles = () => setIsArticlesOpen(!isArticlesOpen);
    const toggleAgencies = () => setIsAgenciesOpen(!isAgenciesOpen);
    const toggleUsers =() => setIsUsersOpen(!isUsersOpen);

    return (
        <div className="flex min-h-screen">
            <aside className="bg-primary text-white w-64 md:w-80 flex flex-col justify-between p-6">
                <div className="flex items-center justify-center mb-8">
                    <img src="/logo2.png" alt="Logo" className="h-12 w-auto" />
                </div>

                <nav className="flex-grow">
                    <ul className="space-y-4">
                    <li>
                            <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                Dashboard
                            </a>
                        </li>

                        <li>
                            <button
                                onClick={toggleArticles}
                                className="flex justify-between items-center w-full py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300"
                            >
                                Articles
                                <FontAwesomeIcon icon={isArticlesOpen ? faChevronUp : faChevronDown} />
                            </button>
                            {isArticlesOpen && (
                                <ul className="ml-4 mt-2 space-y-2">
                                    <li>
                                        <a href="/add-article" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            Add Article
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/view-articles" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            View All Articles
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={toggleAgencies}
                                className="flex justify-between items-center w-full py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300"
                            >
                                Agencies
                                <FontAwesomeIcon icon={isAgenciesOpen ? faChevronUp : faChevronDown} />
                            </button>
                            {isAgenciesOpen && (
                                <ul className="ml-4 mt-2 space-y-2">
                                    <li>
                                        <a href="/add-agency" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            Add Agency
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/view-agencies" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            View All Agencies
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={toggleUsers}
                                className="flex justify-between items-center w-full py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300"
                            >
                                Users
                                <FontAwesomeIcon icon={isUsersOpen ? faChevronUp : faChevronDown} />
                            </button>
                            {isUsersOpen && (
                                <ul className="ml-4 mt-2 space-y-2">
                                    <li>
                                        <a href="/add-user" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            Add User
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/view-users" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                            View All Users
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
            
                         <li>
                            <a href="/contacts" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                Contacts
                            </a>
                        </li>

                        <li>
                            <a href="/newsletters" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                Newsletters
                            </a>
                        </li>
                        <li>
                            <a href="/consultations" className="block py-2 px-4 rounded hover:bg-[#338ca0] transition duration-300">
                                Consultations
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full py-2 px-4 text-red-500 hover:bg-red-600 rounded transition duration-300"
                    >
                        <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
