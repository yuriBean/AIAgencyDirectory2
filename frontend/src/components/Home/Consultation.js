import React, { useState } from 'react';
import { addConsultation, addConsultationNotification } from '../../services/firestoreService'; 
import { useAuth } from '../../context/AuthContext';

const Consultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
    await addConsultation({
      ...formData,
      userId: currentUser.uid,
      timestamp: new Date(),
    }); 
    await addConsultationNotification(currentUser.uid);
    setSubmitted(true);
  } catch (err) {
    setError("There was an error submitting the form. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
    
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-16 min-h-0 bg-center" style={{ backgroundImage: 'url("./assets/consul.png")'  }}>
      <div className="absolute inset-0 bg-primary opacity-85"></div>
      <div className="text-center z-10 px-4 sm:px-8 md:px-12 lg:px-16">
        <h1 className="text-4xl mb-4  text-white font-bold leading-normal">
                        Get a Free 
                Consultation to Find the <br />
                Perfect AI Agency
        </h1>
        <p className="text-lg mb-6 text-white">
        Let us help you connect with the right AI experts to meet your business needs
        </p>
        {submitted ? (
          <div className="text-center p-6 text-white font-medium">
            Thank you for reaching out! We’ll get back to you soon.
          </div>
        ) : (
          <form className="space-y-8 text-white" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white rounded-md focus:outline-none placeholder-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white rounded-md focus:outline-none placeholder-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white rounded-md focus:outline-none placeholder-white"
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white rounded-md focus:outline-none placeholder-white"
            />
          </div>

          <textarea
            name="projectDetails"
            placeholder="Tell Us About Your Project Or What Services You're Interested In"
            value={formData.projectDetails}
            onChange={handleChange}
            className="w-full p-3 border bg-transparent border-white rounded-md h-32 focus:outline-none placeholder-white"
          ></textarea>

          <div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="px-7 font-medium text-xl bg-white text-primary py-3 border border-2 border-transparent rounded-full hover:bg-primary hover:text-white hover:border-white transition"
            >
              {isSubmitting ? "Submitting..." : "Get My Free Consultation"}
            </button>
          </div>
        </form> )}
        </div>
    </section>
  );
};

export default Consultation;
