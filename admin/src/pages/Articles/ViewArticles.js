import React, { useEffect, useState } from 'react';
import { getArticles, deleteArticle, setFeaturedArticle } from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faPen, faStar } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../../components/common/PageHead';

const ViewArticles = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(''); 
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedArticles = await getArticles(); 
      setArticles(fetchedArticles);
    };

    fetchArticles();
  }, []);

  const handleSetFeatured = async (articleId) => {
    await setFeaturedArticle(articleId);
    setArticles(articles.map(article => 
      article.id === articleId ? { ...article, isFeatured: !article.isFeatured } : article
    ));
  };

  const handleDelete = async (articleId) => {
    if(window.confirm('Are you sure you want to delete?')){
    await deleteArticle(articleId);
    setArticles(articles.filter(article => article.id !== articleId)); 
    }
  };

  const handleEdit = (articleId) => {
    navigate(`/edit-article/${articleId}`); 
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
  };

  const filterByDate = (article) => {
    if (!startDate && !endDate) return true; 
    const articleDate = article.dateCreated.toDate();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || articleDate >= start) && (!end || articleDate <= end);
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category ? article.category.toLowerCase() === category.toLowerCase() : true) &&
    filterByDate(article)
  );

  return (
    <>
    <PageHead name='View Articles' />
    <div className="max-w-full mx-auto p-6">

      <div className="flex flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
        <input
          type="text"
          placeholder="Search by title"
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className='text-xl text-primary hidden sm:block' />

        <select
          className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Health">Health</option>
          <option value="Business">Business</option>
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

      <table className="min-w-full bg-gray-100 table-auto text-left my-10 table-layout-auto">
          <thead className="text-xl text-secondary">
            <tr className="bg-gray-200 text-gray-700 text-left">
            <th className="border border-gray-300 px-4 py-1 w-1/6">Featured Image</th>
            <th className="border border-gray-300 px-4 py-1 w-1/6">Title</th>
            <th className="border border-gray-300 px-4 py-1 w-1/6">Category</th>
            <th className="border border-gray-300 px-4 py-1 w-1/6">Date Created</th>
            <th className="border border-gray-300 px-4 py-1 w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map(article => (
            <tr key={article.id} className="border-b">
              <td className="py-2 px-4 border-t border-gray-300 flex justify-center">
                <img loading="lazy" src={article.featuredImage} alt={article.title} className="h-16 object-cover" />
              </td>
              <td className="py-2 px-4 border border-gray-300">{article.title}</td>
              <td className="py-2 px-4 border border-gray-300">{article.category}</td>
              <td className="py-2 px-4 border border-gray-300">{formatDate(article.dateCreated)}</td>
              <td className="grid w-full grid-cols-3 py-2 px-2 border-b border-gray-300 space-x-2 text-center">
              <button
                    onClick={() => handleSetFeatured(article.id)}
                    className={`py-1 px-2 rounded ${article.isFeatured ? 'bg-yellow-500 text-white' : 'text-yellow-500'}`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                </button>
                <button onClick={() => handleEdit(article.id)} className="px-4 py-2">
                  <FontAwesomeIcon icon={faPen} className='text-primary' />
                </button>
                <button onClick={() => handleDelete(article.id)} className="px-4 py-2">
                  <FontAwesomeIcon icon={faTrash} className='text-red-500' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ViewArticles;
