import React, { useEffect, useState } from 'react';
import { getLatestNews } from '../services/firestoreService';
import PageHead from '../components/Common/PageHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import LatestNews from '../components/Common/Latest';
import NewsletterSignup from '../utils/NewsletterSignup';
import { Link } from 'react-router-dom';

const ArticleArchive = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('name');
  const [sortBy, setSortBy] = useState('latest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await getLatestNews();
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles); 
      } catch (err) {
        setError('Failed to fetch agencies.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filterArticles = () => {
      let filtered = articles;

      if (searchTerm) {
        filtered = filtered.filter((article) => {
              return article.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      if (tagFilter) {
        filtered = filtered.filter((article) => article.category === tagFilter);
      }

      if (sortBy === 'latest') {
        filtered = filtered.sort(
          (a, b) => b.dateCreated.seconds - a.dateCreated.seconds
        );
      } else if (sortBy === 'oldest') {
        filtered = filtered.sort(
          (a, b) => a.dateCreated.seconds - b.dateCreated.seconds
        );
      }

      setFilteredArticles(filtered);
      setCurrentPage(1); 
    };

    filterArticles();
  }, [searchTerm, searchOption, articles, sortBy, ratingFilter, tagFilter]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleTagClick = (category) => {
    setTagFilter(category);
    setSearchTerm(''); 
  };

  const clearTagFilter = () => {
    setTagFilter('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg text-red-600">{error}</span>
      </div>
    );
  }

  const slugify = (text) => {
    return text
      .toString()                          
      .toLowerCase()                       
      .trim()                              
      .replace(/\s+/g, '-')                
      .replace(/[^\w\-]+/g, '')            
      .replace(/\-\-+/g, '-');             
  };  

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <>
      <PageHead
        pagename="Explore the Latest Insights in AI"
        subheading="Stay updated with the latest trends, news, and insights in artificial intelligence. Browse through our comprehensive collection of blogs written by industry experts."
      />

      <div className="container mx-auto my-3 p-6 shadow-md rounded-lg">
        <div className="max-w-screen mt-10 mx-auto p-4 sm:p-6">
          <h1 className="text-4xl font-bold text-secondary">Featured Blogs</h1>
        </div>
        <LatestNews />

        <div className="my-12">
          <label className="font-bold text-lg text-primary">
            Find what you're looking for:
          </label>
          <div className="flex flex-col md:flex-row justify-between my-2 items-start md:items-center space-x-0 md:space-x-3 space-y-1">
            <input
              type="text"
              placeholder={`Search`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-primary rounded-md shadow-lg focus:outline-none"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="text-xl text-primary hidden sm:block"
            />
          </div>

          <div className="my-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-start md:items-center">
            <label className="font-bold text-lg text-primary">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-primary rounded-md shadow-sm focus:outline-none"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>

          </div>
        </div>

        <>
          <h3 className="text-primary text-xl font-bold mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-2 mb-12">
            {[...new Set(articles.map((article) => article.category))].map(
              (category, index) => (
                <span
                  key={index}
                  onClick={() => handleTagClick(category)}
                  className={`bg-blue-200 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-lg hover:bg-blue-300 cursor-pointer ${
                    tagFilter === category ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {category}
                </span>
              )
            )}
          </div>

        
        {tagFilter && (
          <div className="mb-6">
            <button
              onClick={clearTagFilter}
              className="text-sm text-blue-500 underline hover:text-blue-700"
            >
              Clear Filter
            </button>
          </div>
        )}
        </>

        <ul className="space-y-6 md:space-y-8">
  {paginatedArticles.map((article) => (
    <li
      key={article.id}
      className="p-4 bg-gray-200 border border-gray-200 rounded-xl shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
      <Link to={`/blog/${slugify(article.title)}`}>
      <img
          src={article.featuredImage}
          alt={article.title}
          className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0"
        />
        </Link>
        <div className="flex flex-col gap-3 justify-center">
          <div>
          <Link to={`/blog/${slugify(article.title)}`}>
          <h3 className="text-xl font-semibold text-gray-900">
            {article.title}
          </h3>
          </Link>
          <small className='text-gray-600'>{formatDate(article.dateCreated)}</small>
          </div>
          <p
            className="max-w-4xl text-gray-600 text-sm sm:text-base mb-4 whitespace-normal break-words"
          >
            {article.metaDescription.length > 150
              ? `${article.metaDescription.substring(0, 150)}...`
              : article.metaDescription}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {article.category}
        </span>
      </div>
    </li>
  ))}
</ul>

        <div className="flex justify-center items-center mt-6 space-x-9">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <NewsletterSignup />
      <div className="max-w-7xl mt-10 mx-auto p-4 sm:p-6">
          <h1 className="text-4xl font-bold text-secondary">Recommended Blogs</h1>
        </div>
        <LatestNews />
    </>
  );
};

export default ArticleArchive;