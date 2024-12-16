import React, { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../services/firestoreService"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import PageHead from "../components/common/PageHead";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactData = await getContacts();
        setContacts(contactData);
      } catch (err) {
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteContact(id); 
      setContacts(contacts.filter(contact => contact.id !== id)); 
    } catch (err) {
      setError("Failed to delete contact.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading contacts...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <>
    <PageHead name='Contact Submissions' />
    <div className="container mx-auto p-6 max-w-screen">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 table-auto text-left my-10 table-layout-auto">
          <thead className="text-xl text-secondary">
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="border border-gray-300 px-4 py-1 w-1/6">Name</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Email</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Subject</th>
              <th className="border border-gray-300 px-4 py-1 w-2/6">Message</th>
              <th className="border border-gray-300 px-4 py-1 w-1/6">Date</th>
              <th className="border border-gray-300 px-4 py-1 w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="border border-gray-300 px-4 py-1">{contact.name}</td>
                <td className="border border-gray-300 px-4 py-1">{contact.email}</td>
                <td className="border border-gray-300 px-4 py-1">{contact.subject}</td>
                <td className="border border-gray-300 px-4 py-1 break-words w-2/6 max-w-20">{contact.message}</td>
                <td className="border border-gray-300 px-4 py-1">{new Date(contact.timestamp?.seconds * 1000).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-1 text-center">
                  <button
                    onClick={() => handleDelete(contact.id)}
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

export default ContactsPage;
