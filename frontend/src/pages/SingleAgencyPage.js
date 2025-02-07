import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgency, addCaseStudy, addTestimonial, addPricing, deleteAgency, deleteCaseStudy, deletePricing, deleteTestimonial, updateTestimonial, updatePricing, updateCaseStudy } from '../services/firestoreService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Pricing from '../components/SingleAgency/Pricing';
import CaseStudies from '../components/SingleAgency/CaseStudies';
import Testimonials from '../components/SingleAgency/Testimonials';
import { useAuth } from '../context/AuthContext';

const SingleAgencyPage = () => {
  const { agencyId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCaseStudyForm, setShowCaseStudyForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [caseStudyData, setCaseStudyData] = useState({
    title: '',
    client: '',
    challenges: '',
    solutions: '',
    results: '',
    date: '',
    link: '',
  });
  const [testimonialData, setTestimonialData] = useState({
    author: '',
    feedback: '',
    rating: '',
  });
  const [pricingData, setPricingData] = useState({
    plan: '',
    features: [],
    price: '',
  });
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingPricing, setEditingPricing] = useState(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);

  const scrollToTop = () => {
    const editFormElement = document.getElementById('editForm');
  
    if (editFormElement) {
      window.scrollTo({
        top: editFormElement.offsetTop - 50, 
        behavior: 'smooth',
      });
    } else {
      console.error("Element with id 'editForm' not found.");
    }  };

  const handleEditTestimonial = (testimonial) => {
    scrollToTop();
    setEditingTestimonial(testimonial);
    setTestimonialData(testimonial);
    setShowTestimonialForm(true);
  };
  
  const handleEditPricing = (pricing) => {
    scrollToTop();
    setEditingPricing(pricing);
    setPricingData(pricing);
    setShowPricingForm(true);
  };
  
  const handleEditCaseStudy = (caseStudy) => {
    scrollToTop();
    setEditingCaseStudy(caseStudy);
    setCaseStudyData(caseStudy);
    setShowCaseStudyForm(true);
  };

  const handleSaveTestimonial = async () => {
    const { author, feedback, rating } = testimonialData;
  if (!author || !feedback || !rating) {
    alert('Please fill out all required fields for the testimonial.');
    return;
  }

    const newTestimonial = {
      ...testimonialData,
    };
  
    try {
      if (editingTestimonial) {
        await updateTestimonial(agencyId, editingTestimonial, testimonialData);
        setAgency((prev) => ({
          ...prev,
          testimonials: prev.testimonials.map((t) => 
            t === editingTestimonial ? testimonialData : t
          ),
        }));
      } else {
        await addTestimonial(agencyId, newTestimonial);
        setAgency((prev) => ({
          ...prev,
          testimonials: [...prev.testimonials, newTestimonial],
        }));
      }
  
      setEditingTestimonial(null);
      setTestimonialData({ author: '', feedback: '', rating: '' });
      setShowTestimonialForm(false);
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };
  
    const handleSavePricing = async () => {
      const { plan, features, price } = pricingData;
      if (!plan || !features || !price) {
        alert('Please fill out all required fields for pricing.');
        return;
      }

      const featuresString = Array.isArray(features) ? features.join(', ') : features;

      const featuresArray = featuresString.split(',').map(feature => feature.trim());
    
      const newPricing = {
        ...pricingData,
        features: featuresArray
      };
    
      try {
        if (editingPricing) {
          await updatePricing(agencyId, editingPricing, newPricing);
          setAgency((prev) => ({
            ...prev,
            pricings: prev.pricings.map((p) => 
              p === editingPricing ? newPricing : p
            ),
          }));
        } else {
          await addPricing(agencyId, newPricing);
          setAgency((prev) => ({
            ...prev,
            pricings: [...prev.pricings, newPricing],
          }));
        }
    
        setEditingPricing(null);
        setPricingData({     
          plan: '',
          features: [],
          price: '',
      });
        setShowPricingForm(false);
      } catch (error) {
        console.error("Error saving pricing:", error);
      }
    };

  const handleSaveCaseStudy = async () => {
    const { title, client, challenges, solutions, results } = caseStudyData;
    if (!title || !client || !challenges || !solutions || !results) {
      alert('Please fill out all required fields for the case study.');
      return;
    }

    const newCaseStudy = {
      ...caseStudyData,
      date: new Date().toLocaleDateString()
    };
  
    try {
      if (editingCaseStudy) {
        await updateCaseStudy(agencyId, editingCaseStudy, caseStudyData);
        setAgency((prev) => ({
          ...prev,
          caseStudies: prev.caseStudies.map((c) => 
            c === editingCaseStudy ? caseStudyData : c
          ),
        }));
      } else {
        await addCaseStudy(agencyId, newCaseStudy);
        setAgency((prev) => ({
          ...prev,
          caseStudies: [...prev.caseStudies, caseStudyData],
        }));
      }
  
      setEditingCaseStudy(null);
      setCaseStudyData({     
        title: '',
        client: '',
        challenges: '',
        solutions: '',
        results: '',
        date: '',
        link: '',
     });
      setShowCaseStudyForm(false);
    } catch (error) {
      console.error("Error saving caseStudies:", error);
    }
  };

  useEffect(() => {

    const fetchAgency = async () => {
      try {
        const agencyData = await getAgency(agencyId);
        setAgency({
          ...agencyData,
        services: agencyData.services || [], 
        caseStudies: agencyData.caseStudies || [],
        testimonials: agencyData.testimonials || [],
        pricings: agencyData.pricings || [],
        });
      } catch (err) {
        setError('Failed to fetch agency.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [agencyId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  const handleCancelT = () => {
    setTestimonialData({
      author: '',
      feedback: '',
      rating: '',
    });
    setEditingTestimonial(null);
    setShowTestimonialForm(false);
  };

  const handleCancelC = () => {
    setCaseStudyData({
      title: '',
      client: '',
      challenges: '',
      solutions: '',
      results: '',
      date: '',
      link: '',
    });
    setEditingCaseStudy(null);
    setShowCaseStudyForm(false);
  };

  const handleCancelP = () => {
    setPricingData({
      plan: '',
      features: [],
      price: '',
    });
    setEditingPricing(null);
    setShowPricingForm(false);
  };

  const handleDelete = async (agencyId) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
        await deleteAgency(agencyId);
    }
    navigate('/dashboard');
};

const handleEdit = (agencyId) => {
    navigate(`/edit-agency/${agencyId}`);
};

const handleDeleteTestimonial = async (testimonial) => {
  if (window.confirm('Are you sure you want to delete this testimonial?')) {
    try {
      await deleteTestimonial(agencyId, testimonial);
      setAgency((prev) => ({
        ...prev,
        testimonials: prev.testimonials.filter((t) => t !== testimonial),
      }));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  }
};

const handleDeletePricing = async (pricing) => {
  if (window.confirm('Are you sure you want to delete this pricing?')) {
    try {
      await deletePricing(agencyId, pricing);
      setAgency((prev) => ({
        ...prev,
        pricings: prev.pricings.filter((p) => p !== pricing),
      }));
    } catch (error) {
      console.error("Error deleting pricing:", error);
    }
  }
};

const handleDeleteCaseStudy = async (caseStudy) => {
  if (window.confirm('Are you sure you want to delete this case study?')) {
    try {
      await deleteCaseStudy(agencyId, caseStudy);
      setAgency((prev) => ({
        ...prev,
        caseStudies: prev.caseStudies.filter((c) => c !== caseStudy),
      }));
    } catch (error) {
      console.error("Error deleting case study:", error);
    }
  }
};

  return (
    <div className="container break-words mx-auto w-full my-12 p-6 shadow-md rounded-lg bg-white overflow-hidden">
      <div className="grid w-full grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className='col-span-1 bg-gray-300 p-4 flex items-center justify-center rounded-lg'>
        <img
        loading="lazy"
                  src={agency.logo || '/placeholder.png'}
                  alt={agency.name}
          className="w-48 h-48 object-contain rounded-full bg-white"
        />
      </div>
      <div className='col-span-3'>
        <div className="flex flex-col space-y-4 m-2">
        <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">{agency.name}</h1>
        {currentUser && currentUser.uid === agency.userId && (
        <div className="space-x-2 ml-4 flex justify-end items-center">
            <button 
                onClick={() => handleEdit(agencyId)} 
                className="text-blue-500 hover:text-blue-700"
            >
            <FontAwesomeIcon icon={faEdit} />
             </button>
             <button 
             onClick={() => handleDelete(agencyId)} 
          className="text-red-500 hover:text-red-700"
           >
          <FontAwesomeIcon icon={faTrash} />
          </button>
         </div>
         )}
         </div>

        <p className="text-gray-600">
          <strong>Industry:</strong> {agency.industry}
        </p>
        
        <p className="text-gray-600">
          <strong>Date Created:</strong> {new Date(agency.dateCreated.seconds * 1000).toLocaleDateString()}
        </p>
        <span className="text-gray-600"><strong>Contact Info: </strong></span>
        <div className='flex flex-col text-gray-600'>
          <p>{agency.email}</p>
          <p>{agency.phone}</p>
        </div>
        <div className='w-full'>
        <p className="text-gray-700 break-words overflow-wrap">{agency.description}</p>
        </div>

        <div className="flex mt-4">
          <a
            href={agency.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-primary text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
          >Visit Website
                        </a>
                    </div>

        </div>
      </div>
      </div>
      <div className="mt-8 flex-col space-y-5">
      {agency.services.length > 0 && (
        <>
        <h2 className="text-2xl font-bold text-primary">Services Offered</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {agency.services.map((service, index) => (
            <span
              key={index}
              className="bg-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-lg"
            >
              {service}
            </span>
          ))}
        </div>
        </>
        )}
        <CaseStudies caseStudies={agency.caseStudies} isOwner = {currentUser && currentUser.uid === agency.userId} onDelete={handleDeleteCaseStudy} onEdit={handleEditCaseStudy} />
        <Testimonials testimonials={agency.testimonials} isOwner = {currentUser && currentUser.uid === agency.userId} onDelete={handleDeleteTestimonial} onEdit={handleEditTestimonial} />
        <Pricing pricings={agency.pricings} isOwner = {currentUser && currentUser.uid === agency.userId} onDelete={handleDeletePricing} onEdit={handleEditPricing} />
      </div>

{currentUser && currentUser.uid === agency.userId && (
      <div className='my-10 flex flex-col md:flex-row gap-5'>
        <button
          onClick={() => {
            setShowTestimonialForm(false);
            setShowCaseStudyForm(true); 
            setShowPricingForm(false);
          }}
          className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
        >
          Add Case Study
        </button>
        <button 
          onClick={() => {
            setShowTestimonialForm(true);
            setShowCaseStudyForm(false);
            setShowPricingForm(false);
          }}        
          className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
        >
          Add Testimonial
        </button>
        <button 
          onClick={() => {
            setShowTestimonialForm(false);
            setShowCaseStudyForm(false);
            setShowPricingForm(true);
          }}        
          className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
        >
          Add Pricing
        </button>

      </div>)}

          <div id='editForm'>
      {showCaseStudyForm && (
        <div className="my-6 bg-gray-300 p-5 rounded-lg">
          <h3  className="text-xl font-semibold my-2">
            {editingCaseStudy ? 
              'Edit Case Study' : 'Add Case Study'
            }
            
            </h3>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={caseStudyData.title}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, title: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="client"
              placeholder="Client"
              value={caseStudyData.client}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, client: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="challenges"
              placeholder="Challenges"
              value={caseStudyData.challenges}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, challenges: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="solutions"
              placeholder="Solutions"
              value={caseStudyData.solutions}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, solutions: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="results"
              placeholder="Results"
              value={caseStudyData.results}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, results: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="link"
              placeholder="Link (optional)"
              value={caseStudyData.link}
              onChange={(e) => setCaseStudyData(prevData => ({ ...prevData, link: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <button 
            onClick={handleSaveCaseStudy}
            className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button 
            onClick={handleCancelC}
            className="px-7 text-lg text-red-500 py-3 border border-2 border-transparent rounded-full transition"
          >
            Cancel
          </button>
        </div>
      )}
</div>
<div id='editForm'>

      {showTestimonialForm && (
        <div className="my-6 bg-gray-300 p-5 rounded-lg">
          <h3  className="text-xl my-2 font-semibold">
            {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial' }
            </h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Author"
              value={testimonialData.author}
              onChange={(e) => setTestimonialData(prevData => ({ ...prevData, author: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
          <select
            value={testimonialData.rating || ''}
            onChange={(e) => setTestimonialData(prevData => ({
                ...prevData,
                rating: e.target.value
            }))}
            className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            >
            <option value="" disabled>Select Rating</option>
            {[0, 1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>
                {rating}
                </option>
            ))}
            </select>
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Feedback"
              value={testimonialData.feedback}
              onChange={(e) => setTestimonialData(prevData => ({ ...prevData, feedback: e.target.value }))}
              className="w-full p-3 border border-primary rounded-lg focus:outline-none"
            />
          </div>
          <button 
            onClick={handleSaveTestimonial}
            className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button 
            onClick={handleCancelT}
            className="px-7 text-lg text-red-500 py-3 border border-2 border-transparent rounded-full transition"
          >
            Cancel
          </button>
        </div>
      )}
      </div>
          <div id='editForm'>

      {showPricingForm && (

<div className="my-6 bg-gray-300 p-5 rounded-lg">
      <h3 className="text-xl my-2 font-semibold">
        {editingPricing ? 'Edit Pricing' : 'Add Pricing Information' }
        </h3>
      <input
        type="text"
        name="plan"
        placeholder="Plan"
        value={pricingData.plan}
        onChange={(e) => setPricingData(prevData => ({ ...prevData, plan: e.target.value }))}
        className="w-full p-3 border border-primary rounded-lg focus:outline-none mb-4"
      />
      <input
        type="text"
        name="features"
        placeholder="Features (comma-separated)"
        value={pricingData.features}
        onChange={(e) => setPricingData(prevData => ({ ...prevData, features: e.target.value }))}
        className="w-full p-3 border border-primary rounded-lg focus:outline-none mb-4"
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={pricingData.price}
        onChange={(e) => setPricingData(prevData => ({ ...prevData, price: e.target.value }))}
        className="w-full p-3 border border-primary rounded-lg focus:outline-none mb-4"
      />
      <button 
        onClick={handleSavePricing}
        className="px-7 font-medium text-xl bg-primary text-white py-3 border border-2 border-transparent rounded-full hover:bg-blue-600 transition"
      >
        Submit
      </button>
      <button 
            onClick={handleCancelP}
            className="px-7 text-lg text-red-500 py-3 border border-2 border-transparent rounded-full transition"
          >
            Cancel
          </button>
    </div>
)}</div>

    </div>
  );
};

export default SingleAgencyPage;
