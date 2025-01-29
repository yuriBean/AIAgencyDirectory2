import React, { useState, useEffect } from 'react';
import { addCategory, getCategories, deleteCategory, updateCategory } from '../../services/firestoreService';
import PageHead from '../../components/common/PageHead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const Categories = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      try {
        if (editingCategory) {
            await updateCategory(editingCategory.id, categoryName);
          setCategories(
            categories.map((cat) => (cat.name === editingCategory.name ? { name: categoryName } : cat))
          );
          setEditingCategory(null); 
        } else {
          await addCategory(categoryName);
          setCategories([...categories, { name: categoryName }]);
        }
        setCategoryName('');
      } catch (error) {
        setError('Failed to add or update category');
      }
    } else {
      setError('Category name cannot be empty');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category); 
    setCategoryName(category.name); 
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  return (
    <>
      <PageHead name="Manage Categories" />
      <div className="max-w-full mx-auto p-6">
        <div className="flex flex-col items-center justify-center my-16 mx-2">
          <form className="flex flex-col justify-center space-y-8 text-grey-600 w-full md:w-2/3" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-xs">Category</label>
              <input
                type="text"
                value={categoryName}
                onChange={handleChange}
                placeholder="Add a category"
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
              <div className="my-10 flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-primary text-white text-lg px-5 py-2 rounded"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>
          <div className='flex flex-col justify-center space-y-8 text-grey-600 w-full md:w-2/3'>
            <h2 className="text-xl font-semibold">Existing Categories</h2>
            <table className="min-w-full bg-gray-100 table-auto text-left my-10 table-layout-auto">
          <thead className="text-xl text-secondary">
          <tr className="bg-gray-200 text-gray-700 text-left">
          <th className="border border-gray-300 px-4 py-1 w-1/6">Category Name</th>
                  <th className="border border-gray-300 px-4 py-1 w-1/6 ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className=" border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-1 w-2/3">{category.name}</td>
                    <td className=" flex justify-around">
                      <button
                        onClick={() => handleEdit(category)}
                        className=" text-primary py-1 px-2 rounded hover:bg-primary hover:text-white"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 py-1 px-2 rounded hover:bg-red-500 hover:text-white"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
