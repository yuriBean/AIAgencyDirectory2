import React, { useEffect, useState } from "react";
import { getConsultations, deleteConsultations } from "../services/firestoreService"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import PageHead from "../components/common/PageHead";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const consultationData = await getConsultations();
        setConsultations(consultationData);
      } catch (err) {
        setError("Failed to load consultations.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteConsultations(id); 
      setConsultations(consultations.filter(consultation => consultation.id !== id)); 
    } catch (err) {
      setError("Failed to delete consultation.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading consultations...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <>
    <PageHead name='Consultation Submissions' />
    <div className="container mx-auto p-6 max-w-screen">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 table-auto text-left my-10 table-layout-auto">
          <thead className="text-xl text-secondary">
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="border border-gray-300 px-4 py-1 w-1/6">Name</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Email</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Phone</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Company Name</th>
              <th className="border border-gray-300 px-4 py-1 w-2/6">Message</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Date</th>
              <th className="border border-gray-300 px-4 py-1 w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.id}>
                <td className="border border-gray-300 px-4 py-1">{consultation.name}</td>
                <td className="border border-gray-300 px-4 py-1">{consultation.email}</td>
                <td className="border border-gray-300 px-4 py-1">{consultation.phone}</td>
                <td className="border border-gray-300 px-4 py-1">{consultation.company}</td>
                <td className="border border-gray-300 px-4 py-1 break-words w-2/6 max-w-20">{consultation.projectDetails}</td>
                <td className="border border-gray-300 px-4 py-1">{new Date(consultation.timestamp?.seconds * 1000).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-1 text-center">
                  <button
                    onClick={() => handleDelete(consultation.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default Consultations;
