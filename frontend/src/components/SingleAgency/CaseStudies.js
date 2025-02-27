import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CaseStudies = ({ caseStudies, onDelete, isOwner, onEdit }) => {
  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-primary">Case Studies</h2>
      {caseStudies.map((caseStudy, index) => (
        <div
          key={index}
          className="border relative shadow-md shadow-secondary p-12 rounded-lg my-6 bg-white"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">
            {caseStudy.title}
          </h3>
          {isOwner && (
            <div>
              <button
              onClick={() => onEdit(caseStudy)}
              className=" absolute top-3 right-9 text-blue-500 hover:text-blue-700"
              >
                <FontAwesomeIcon icon={faEdit} />
                </button>

          <button 
          onClick={() => onDelete(caseStudy)}
          className=" absolute top-3 right-3 text-red-500 hover:text-red-700 ml-4"
            > <FontAwesomeIcon icon={faTrash} /></button>
            </div>
            )}
          <div className="mx-0 md:mx-16 mb-6">
            <p className="text-secondary text-lg font-semibold mb-1">Client</p>
            <p className="text-gray-900 mb-4">{caseStudy.client}</p>
            <p className="text-secondary text-lg font-semibold mb-1">
              Challenges
            </p>
            <p className="text-gray-900 mb-4">{caseStudy.challenges}</p>
            <p className="text-secondary text-lg font-semibold mb-1">
              Solutions
            </p>
            <p className="text-gray-900 mb-4">{caseStudy.solutions}</p>
            <p className="text-secondary text-lg font-semibold mb-1">
              Results
            </p>
            <p className="text-gray-900 mb-4">{caseStudy.results}</p>
          </div>
          <p className="text-sm m:0 text-end text-gray-500 mb-4">
            <strong>Date:</strong> {caseStudy.date}
          </p>
          {caseStudy.link && (
            <div className="flex justify-center mt-4">
              <a
                href={caseStudy.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
              >
                Check This Case Out
              </a>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default CaseStudies;
