import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticleBySlug } from '../services/firestoreService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getArticleBySlug(slug);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found.</div>;

  return (
    <div className="container max-w-5xl mx-auto p-6 my-10 articlesClass">
      <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
      <span className="text-gray-600 text-sm flex gap-3 items-center">
        {formatDate(article.dateCreated)} 
        <FontAwesomeIcon icon={faCircle} className='text-xs text-gray-300' />
        <div className='bg-blue-200 rounded-full px-2'>
          <p className='text-primary font-bold'>{article.category}</p>
        </div>
      </span>
      <img src={article.featuredImage} alt={article.title} className="mt-4 w-full h-[500px] object-cover object-top rounded" />
      <div className="mt-4 article-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
    </div>
  );
};

export default ArticlePage;
