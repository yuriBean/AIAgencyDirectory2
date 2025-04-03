import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { addArticle, getCategories } from '../../services/firestoreService';
import { uploadImage } from '../../utils/uploadImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import PageHead from '../../components/common/PageHead';

const AddArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metaDescription: '',
    featuredImage: null,
    category: '',
    ctaText: '',
    dateCreated: new Date(),
  });
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageName, setImageName] = useState('');
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'featuredImage') {
      setFormData({ ...formData, featuredImage: files[0] });
      setImageName(files[0]?.name || '');
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();  
      setCategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  const handleRemoveImage = () => {
    setFormData({ ...formData, featuredImage: null });
    setImageName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = '';

      if (formData.featuredImage) {
        const path = `article/featured_images/`;
        imageUrl = await uploadImage(formData.featuredImage, path);
      }

      const articleData = {
        title: formData.title,
        content: formData.content,
        metaDescription: formData.metaDescription,
        category: formData.category,
        ctaText: formData.ctaText,
        featuredImage: imageUrl,
        dateCreated: new Date(),
      };

      await addArticle(articleData);
      setError('');
      console.log('Article submitted successfully');
      setFormData({
        title: '',
        content: '',
        metaDescription: '',
        featuredImage: null,
        category: '',
        ctaText: "",  
        dateCreated: new Date(),    
      });
    } catch (err) {
      setError('Failed to submit the article. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='max-w-screen overflow-hidden'>
    <PageHead name='Add New Article' />
      <div className='flex items-center justify-center my-16 mx-6'>
        <form className="flex flex-col justify-center space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
        <div>
        <label className="text-xs">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Article Title"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
          />
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <label className='text-xs'>Meta Description</label>
          <div className="text-xs text-gray-500 mt-2">
        {formData.metaDescription.length}/160 characters
          </div>
          </div>
          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            onChange={handleChange}
            maxLength="160"
            className="w-full p-3 border bg-transparent border-gray-600 border-2 rounded-xs h-24 focus:outline-none placeholder-gray-500"
          />
          </div>

      <div className=" w-full">
        <label className="text-xs">Category</label>

          <select
            name="category"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none text-gray-500"
          >
            <option value="" disabled selected>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
        </div>
        <div>
          <label className='text-xs'>CTA Text</label>
          <input
            type="text"
            name="ctaText"
            placeholder="Enter CTA Text"
            value={formData.ctaText}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
          />
        </div>

          <div className=" w-full">
        <label className="text-xs">Featured Image</label>
            <label className="block p-3 bg-transparent border border-gray-600 border-2 rounded-xs text-gray-500 focus-within:outline-none cursor-pointer">
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
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
              />
            </label>
          </div>
          
          <div className='mb-10 overflow-hidden'>
              <label className='text-xs'>Content</label>
              <ReactQuill
               value={formData.content}
               theme='snow'
              onChange={(content) => setFormData({ ...formData, content })}
              className="border border-gray-600 border-2 rounded-xs"
              style={{
                maxHeight: '400px',
                height: '200px',
                minHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            />

            </div>
          <div className='my-32 flex justify-center items-center'>
          <button type="submit" className='bg-primary text-white text-lg px-5 py-2 hover:bg-blue-600 rounded'>
          {isUploading ? 'Submitting...' : 'Submit Article'}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>

  );
};

export default AddArticle;
