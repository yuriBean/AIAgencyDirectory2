import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Pricing = ({ pricings, onDelete, isOwner, onEdit }) => (
  <>
    {pricings?.length > 0 && (
      <h2 className="text-2xl font-bold text-primary">Pricing</h2>
    )}
    <div className="container mx-auto my-12 p-6 shadow-md rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 mx-0 md:mx-24 gap-6 text-center break-words">
        {pricings?.length > 0 &&
          pricings.map((pricing, index) => (
            <div
              key={index}
              className="border relative shadow-md shadow-secondary p-4 md:p-14 rounded-lg space-y-8 my-4 overflow-hidden"
            >
          {isOwner && (
            <div>
            <button
            onClick={() => onEdit(pricing)}
            className=" absolute top-3 right-9 text-blue-500 hover:text-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
          onClick={() => onDelete(pricing)}
          className=" absolute top-3 right-3 text-red-500 hover:text-red-700 ml-4"
            > <FontAwesomeIcon icon={faTrash} /></button>
            </div>
          )}
              <p className="text-xl font-bold text-secondary">{pricing.plan}</p>
              <p className="text-3xl font-bold text-primary">
                ${pricing.price}
              </p>
              <ul className="text-gray-500 mx-0 md:mx-14 list-disc list-inside text-left">
                {pricing.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  </>
);

export default Pricing;
