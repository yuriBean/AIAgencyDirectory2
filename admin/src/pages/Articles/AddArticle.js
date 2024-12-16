import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { addArticle } from '../../services/firestoreService';
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
    dateCreated: new Date(),
  });
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageName, setImageName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'featuredImage') {
      setFormData({ ...formData, featuredImage: files[0] });
      setImageName(files[0]?.name || '');
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
    <>
    <PageHead name='Add New Article' />
    <div className="max-w-full mx-auto p-6">
      <div className='flex items-center justify-center my-16 mx-2'>
        <form className="flex flex-col justify-center space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Article Title"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-1 rounded-xs focus:outline-none placeholder-gray-500"
          />
          
          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            onChange={handleChange}
            className="w-full p-3 border bg-transparent border-gray-600 border-1 rounded-xs h-16 focus:outline-none placeholder-gray-500"
          />

<div className=" w-full">
          <select
            name="category"
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-gray-600 border-1 rounded-xs focus:outline-none text-gray-500"
          >
            <option value="" disabled selected>Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>

          <div className=" w-full">
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
                name="featuredImage"
                accept="image/*"
                onChange={handleChange}
                className="sr-only"
              />
            </label>
          </div>
          <div className='mb-10'>
          <ReactQuill
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            className="border border-gray-600 rounded"
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
    </>

  );
};

export default AddArticle;
