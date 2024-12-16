import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, updateArticle } from '../../services/firestoreService';
import { uploadImage } from '../../utils/uploadImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import PageHead from '../../components/common/PageHead';

const EditArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metaDescription: '',
    category: '',
    featuredImage: null,
  });
  
  const [imageName, setImageName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      const article = await getArticle(articleId);
      setFormData({
        title: article.title,
        content: article.content,
        metaDescription: article.metaDescription,
        category: article.category,
        featuredImage: article.featuredImage,
      });
      setImageName(article.featuredImage || ''); 
    };

    fetchArticle();
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prevState) => ({ ...prevState, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, featuredImage: file }));
    setImageName(file ? file.name : '');
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: null }));
    setImageName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    try {
      let imageUrl = formData.featuredImage;

      if (formData.featuredImage && typeof formData.featuredImage !== 'string') {
        const path = `article/featured_images/`;
        imageUrl = await uploadImage(formData.featuredImage, path);
      }

      const updatedArticleData = {
        title: formData.title,
        content: formData.content,
        metaDescription: formData.metaDescription,
        category: formData.category,
        featuredImage: imageUrl,
      };

      await updateArticle(articleId, updatedArticleData);
      console.log('Article updated successfully');
      navigate('/view-articles'); 
    } catch (err) {
      setError('Failed to update the article. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    <PageHead name='Edit Article' />
    <div className="max-w-5xl mx-auto p-6">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
        <div className="mb-4 space-y-2">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-1 rounded-xs focus:outline-none placeholder-gray-500"
            required
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-gray-700">Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your article content here..."
            className="border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full p-3 border bg-transparent border-gray-600 border-1 rounded-xs h-16 focus:outline-none placeholder-gray-500"
            rows={2}
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-1 rounded-xs focus:outline-none text-gray-500"
          >
            <option value="" disabled>Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        <div className="mb-4 space-y-2">
          <label className="block p-3 bg-transparent border border-gray-600 border-1 rounded-xs text-gray-500 focus-within:outline-none cursor-pointer">
            {imageName ? (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faImage} className='text-lg mr-3' />
                <span className="truncate">{imageName}</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} className='text-lg mr-3' />
                <span className="placeholder-gray-500">Upload Featured Image</span>
              </>
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="sr-only"
              accept="image/*"
            />
          </label>
        </div>
        <div className='my-32 flex justify-center items-center'>
          <button type="submit" className='bg-primary text-white text-lg px-5 py-2 hover:bg-blue-600 rounded'>
          {isUploading ? 'Updating...' : 'Update Article'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
    </>

  );
};

export default EditArticle;
