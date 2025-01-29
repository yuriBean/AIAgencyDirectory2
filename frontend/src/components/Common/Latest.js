import React, { useEffect, useState } from 'react';
import { getLatestNews } from '../../services/firestoreService';
import {Link} from 'react-router-dom';

const LatestNews = ({ label }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      const data = await getLatestNews();
      const topBlogs = data.slice(0,3);

      const filteredBlogs = label === 'featured' 
        ? data.filter(blog => blog.isFeatured) 
        : topBlogs;

      setArticles(filteredBlogs);
    };
    fetchLatestNews();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
  };

  const slugify = (text) => {
    return text
      .toString()                          
      .toLowerCase()                       
      .trim()                              
      .replace(/\s+/g, '-')                
      .replace(/[^\w\-]+/g, '')            
      .replace(/\-\-+/g, '-');             
  };  

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 mt-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex justify-between flex-col gap-3"
          >
            <div>
              <img
              loading="lazy"
                src={article.featuredImage}
                alt={article.name}
                className=" w-full h-48 object-cover"
              />
            <div className="flex flex-col justify-between items-start text-left mt-2 mb-4">
            <span className="text-primary text-base text-md font-medium">{formatDate(article.dateCreated)}</span>
            <h2 className="text-xl sm:text-3xl font-bold text-left text-secondary">{article.title}</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-4 whitespace-normal break-words">
            {article.metaDescription.length > 150
              ? `${article.metaDescription.substring(0, 150)}...`
              : article.metaDescription}
          </p>
          </div>
            <div>
              <Link to={`/blog/${slugify(article.title)}`}>
              <button className="mt-auto font-bold text-primary rounded-full hover:underline">
                Read More &rarr;
              </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
