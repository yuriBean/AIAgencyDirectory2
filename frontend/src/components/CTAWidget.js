import React from 'react';

const CTAWidget = ({ text }) => {
  return (
    <div className="bg-orange-500 text-white p-4 text-center rounded-md my-4 shadow-md">
      <h3 className="text-lg font-bold">Don't Miss Out!</h3>
      <p className="text-sm">{text}</p>
      <button className="bg-white text-orange-500 px-4 py-2 mt-2 rounded font-semibold hover:bg-gray-200">
        Learn More
      </button>
    </div>
  );
};

export default CTAWidget;
