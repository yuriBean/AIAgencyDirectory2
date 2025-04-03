import React from 'react';

const CTAWidget = ({ heading, text, buttonText, buttonLink }) => {
  const handleClick = () => {
    console.log(buttonLink)
    if (typeof buttonLink === "string") {
      console.log(buttonLink);
      window.location.href = buttonLink; 
    } else if (typeof buttonLink === "function") {
      buttonLink(); 
    }
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center py-16 min-h-0 bg-center rounded-lg mx-0 md:mx-10"
      style={{ backgroundImage: 'url("/assets/consul.png")' }}
    >
      <div className="absolute inset-0 bg-primary opacity-85 rounded-lg"></div>
      <div className="text-center z-10 px-4 sm:px-8 md:px-12 lg:px-16">
        <h3 className="text-4xl mb-4 text-white font-bold leading-normal">
          {heading ?? "Don't Miss Out!"}
        </h3>
        <p className="text-lg mb-6 text-white">
          {text ?? "Submit your agency to get featured today and earn game-changing leads."}
        </p>
        <button
          onClick={handleClick}
          className="px-7 font-medium text-md md:text-xl bg-white text-primary py-3 border border-2 border-transparent rounded-full hover:bg-primary hover:text-white hover:border-white transition"
        >
          {buttonText ?? "Learn More"}
        </button>
      </div>
    </section>
  );
};

export default CTAWidget;
