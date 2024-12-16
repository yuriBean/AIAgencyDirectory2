import React from 'react';

const PageHead = ({ name }) => {
  return (
    <div className='relative min-h-60 flex flex-col text-center items-center justify-center py-16 px-4 sm:px-4 bg-center bg-cover' style={{ backgroundImage: 'url("/assets/admin1.jpg")' }}>
      <div className="absolute inset-0 bg-primary opacity-70"></div>
      <h1 className='text-white font-bold text-5xl leading-normal z-10'>{name}</h1>
    </div>
  );
};

export default PageHead;
