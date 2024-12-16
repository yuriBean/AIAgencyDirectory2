import React, { useState } from "react";
import { addContactSubmission , addContactNotification} from "../services/firestoreService";
import PageHead from "../components/Common/PageHead";
import { useAuth } from "../context/AuthContext";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      await addContactSubmission({
        ...formData,
        // userId: currentUser.uid,
        timestamp: new Date(),
      });
      await addContactNotification();
      setSubmitted(true);
    } catch (err) {
      setError("There was an error submitting the form. Please try again.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <PageHead pagename='Contact Us' />
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8">
        {!submitted && (
        <p className="text-gray-600 text-center mb-8">
          We're here to help! Please fill out the form below, and we'll get back to you shortly.
        </p>
        )}

        {submitted ? (
          <div className="text-center p-6 text-primary font-medium">
            Thank you for reaching out! We’ll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
            </div>

            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 bg-transparent border border-gray-600 border-2 rounded-xs focus:outline-none placeholder-gray-500"
                ></textarea>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 font-semibold rounded-xl shadow 
              ${isSubmitting ? "bg-gray-400" : "bg-primary hover:bg-blue-700"} 
              text-white transition duration-200`}
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
};

export default ContactUs;
