import React from 'react'

const PageHead = ( {pagename, subheading} ) => {
  return (
    <div className='relative min-h-80 flex flex-col text-center items-center justify-center py-16 px-4 sm:px-4 bg-bottom bg-cover' style={{ backgroundImage: 'url("/assets/test1.jpg")' }}>
      <div className="absolute inset-0 bg-primary opacity-80"></div>
        <h1 className='text-white font-bold text-5xl leading-normal z-10'>{pagename}</h1>
        <span className='text-white leading-normal text-lg w-full md:w-2/3 z-10'>{subheading}</span>
    </div>
  )
}

export default PageHead;
