import React from 'react';

const Pricing = ({ pricings }) => (
  <>
  {pricings.length > 0 && <h2 className="text-2xl font-bold text-primary">Pricing</h2>}
  <div className="container mx-auto my-12 p-6 shadow-md rounded-lg bg-white">
    <div className="grid grid-cols-1 md:grid-cols-2 mx-0 md:mx-24 gap-6 text-center break-words">
      {pricings?.map((pricing, index) => (
        <div key={index} className="border shadow-md shadow-secondary p-4 md:p-14 rounded-lg space-y-8 my-4 overflow-hidden">
          <p className=" text-xl font-bold text-secondary">{pricing.plan}</p>
          <p className="text-3xl font-bold text-primary">${pricing.price}</p>
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