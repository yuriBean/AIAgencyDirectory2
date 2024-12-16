import React, { useEffect, useState } from "react";
import { getNewsletters, updateNewsletterApproval } from "../services/firestoreService"; 
import PageHead from "../components/common/PageHead";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFileExport } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from "xlsx";

const Newsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const newsletterData = await getNewsletters();
        setNewsletters(newsletterData);
      } catch (err) {
        setError("Failed to load newsletters.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  const handleApproval = async (id, currentApprovalStatus) => {
    try {
      const updatedStatus = !currentApprovalStatus; 
      await updateNewsletterApproval(id, updatedStatus);
      setNewsletters(newsletters.map(newsletter =>
        newsletter.id === id ? { ...newsletter, approved: updatedStatus } : newsletter
      )); 
    } catch (err) {
      setError("Failed to update approval status.");
    }
  };

  const exportToExcel = () => {
    const exportData = newsletters.map(({ email, subscribedAt, approved }) => ({
      Email: email,
      "Subscribed At": new Date(subscribedAt?.seconds * 1000).toLocaleString(),
      Approved: approved ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Newsletters");

    XLSX.writeFile(workbook, "newsletters.xlsx");
  };

  if (loading) return <p className="text-center mt-4">Loading newsletters...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <>
      <PageHead name="Newsletter Subscriptions" />
      <div className="container mx-auto p-6">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={exportToExcel}
            className="bg-primary px-4 py-2 text-white rounded "
          >
            <FontAwesomeIcon icon={faFileExport} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 table-auto text-left my-10">
            <thead className="text-xl text-secondary">
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="border border-gray-300 px-4 py-1">Email</th>
                <th className="border border-gray-300 px-4 py-1">Subscribed At</th>
                <th className="border border-gray-300 px-4 py-1">Approved</th>
                <th className="border border-gray-300 px-4 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {newsletters.map((newsletter) => (
                <tr key={newsletter.id}>
                  <td className="border border-gray-300 px-4 py-1">{newsletter.email}</td>
                  <td className="border border-gray-300 px-4 py-1">
                    {new Date(newsletter.subscribedAt?.seconds * 1000).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-1">
                    {newsletter.approved ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-gray-300 px-4 py-1 text-center">
                    <button
                      onClick={() => handleApproval(newsletter.id, newsletter.approved)}
                    >
                        {!newsletter.approved ? (
                        <FontAwesomeIcon icon={faCheck} className="text-green-500" />):
                        (<small className="text-xs text-gray-400">Approved</small>)}
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

export default Newsletters;
