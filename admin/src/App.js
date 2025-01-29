import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './context/ProtectedRoute';
import ViewAgencies from './pages/Agency/ViewAgencies';
import EditAgency from './pages/Agency/EditAgency';
import AddAgency from './pages/Agency/AddAgency';
import AddUser from './pages/Users/AddUser';
import ViewUsers from './pages/Users/ViewUsers';
import EditUser from './pages/Users/EditUser';
import AddArticle from './pages/Articles/AddArticle';
import ViewArticles from './pages/Articles/ViewArticles';
import EditArticle from './pages/Articles/EditArticle';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/Contact';
import Newsletters from './pages/Newsletters';
import Consultations from './pages/Consultations';
import Categories from './pages/Settings/Categories';

function App() {
  const { user } = useAuth();

  return (
      <Router>
      <div className="flex">
        {user && <Sidebar />} 
        <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
              path="/" 
              element={<div className="text-center min-h-screen flex flex-col space-y-5 justify-center items-center ">
                <h1 className='text-4xl font-bold text-secondary'>AI Agency Directory</h1>
                <Link to='/login'><button className='text-white bg-primary text-xl px-6 py-2 rounded'>Login</button></Link>
                </div>} 
            />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="content-wrapper">
                  <Routes>
                    <Route path="/view-agencies" element={<ViewAgencies />} />
                    <Route path="/edit-agency/:agencyId" element={<EditAgency />} />
                    <Route path="/add-agency" element={<AddAgency />} />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/view-users" element={<ViewUsers />} />
                    <Route path="/edit-user/:userId" element={<EditUser />} />
                    <Route path="/add-article" element={<AddArticle />} />
                    <Route path="/view-articles" element={<ViewArticles />} />
                    <Route path="/edit-article/:articleId" element={<EditArticle />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/newsletters" element={<Newsletters />} />
                    <Route path="/consultations" element={<Consultations />} />
                    <Route path="/categories" element={<Categories />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        </div>
        </div>
      </Router>
  );
}

export default App;
