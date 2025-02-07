import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';

const Testimonials = ({ testimonials, onDelete, isOwner, onEdit }) => (
  <>
    {testimonials.length > 0 && <h2 className="text-2xl font-bold text-primary">Testimonials</h2>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
      {testimonials?.map((testimonial, index) => (
        <div key={index} className="border shadow-md relative shadow-secondary p-4 rounded-lg my-4 overflow-hidden">
          {isOwner && (
            <div>
            <button
            onClick={() => onEdit(testimonial)}
            className=" absolute top-3 right-9 text-blue-500 hover:text-blue-700"
            >
              <FontAwesomeIcon icon={faEdit} />
              </button>
          <button 
          onClick={() => onDelete(testimonial)}
          className=" absolute top-3 right-3 text-red-500 hover:text-red-700 ml-4"
           >
            <FontAwesomeIcon icon={faTrash} />
            </button>
            </div>
          )}
          <p className="italic text-lg break-words">"{testimonial.feedback}"</p>
          <p className="text-gray-500">{testimonial.author}</p>
          <div className="flex justify-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={`${i < Number(testimonial.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);

export default Testimonials;
