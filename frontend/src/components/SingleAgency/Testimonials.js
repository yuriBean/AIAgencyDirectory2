import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Testimonials = ({ testimonials }) => (
  <>
    {testimonials.length > 0 && <h2 className="text-2xl font-bold text-primary">Testimonials</h2>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
      {testimonials?.map((testimonial, index) => (
        <div key={index} className="border shadow-md shadow-secondary p-4 rounded-lg my-4 overflow-hidden">
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
