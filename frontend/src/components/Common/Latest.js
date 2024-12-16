import React, { useEffect, useState } from 'react';
import { getLatestNews } from '../../services/firestoreService';
import {Link} from 'react-router-dom';

const LatestNews = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      const data = await getLatestNews();
      setArticles(data);
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
    <div className="max-w-7xl mt-10 mx-auto p-4 sm:p-6">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 mt-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6 flex flex-col gap-3"
          >
              <img
                src={article.featuredImage}
                alt={article.name}
                className="object-cover"
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
