import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getTestimonials } from '../../services/firestoreService'; 

const Clients = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await getTestimonials();
      setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const settings = {
    dots: false, // Disable default dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  const renderCustomDots = () => (
    <div className="custom-dots flex justify-center mt-4">
      {testimonials.map((_, index) => (
        <button
          key={index}
          className={`dot w-4 h-4 rounded-full mx-2 ${
            currentSlide === index ? 'bg-[#1D2FD8] scale-125' : 'bg-gray-300'
          }`}
          onClick={() => sliderRef.slickGoTo(index)} 
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );

  let sliderRef;

  return (
    <section className="p-12 flex flex-col justify-center items-center my-16">
      <h1 className="text-4xl text-secondary font-bold leading-normal">
        What Our Clients Say
      </h1>
      <div className="container max-w-4xl w-full">
        <Slider {...settings} ref={(slider) => (sliderRef = slider)}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full p-6 space-y-8 bg-white rounded-md shadow-xl"
            >
              <div className="flex items-center justify-center w-full">
                <img
                  src="./assets/quote.png"
                  alt={testimonial.name}
                  className="w-20 h-20"
                />
              </div>
              <blockquote className="max-w-4xl text-2xl italic text-center">
                "{testimonial.text}"
              </blockquote>
              <div className="text-center">
                <p className="text-primary text-xl font-bold">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </Slider>
        {renderCustomDots()} 
      </div>
    </section>
  );
};

export default Clients;
