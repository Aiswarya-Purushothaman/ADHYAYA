import React, { useState, useEffect, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import '../../style/carousel.css'; 

const carouselItems = [
  { src: "https://img.freepik.com/free-photo/portrait-young-male-professor-education-day_23-2150980043.jpg", title: "Professional Instructors" },
  { src: "https://img.freepik.com/free-photo/realistic-phone-studio-social-media-concept_23-2151459513.jpg", title: "Chat with Instructors" },
  { src: "https://img.freepik.com/free-photo/3d-cash-money_23-2151344869.jpg", title: "Online Payment" },
  { src: "https://img.freepik.com/premium-photo/media-player…ndphone-icon-design-flat-style_1197797-166533.jpg", title: "Countless Videos" },
  { src: "https://img.freepik.com/free-photo/view-3d-school-desk_23-2151103666.jpg", title: "Premium Content" },
  { src: "https://img.freepik.com/premium-photo/3d-certifica…vector-render-white-background_839035-1702140.jpg", title: "Certifications" },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
console.log('courosal')
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length),
      3000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center  overflow-y: auto justify-center   w-full p-16 ">
      <div className="relative w-full max-w-xs shadow-2xl mx-auto   rounded-lg overflow-hidden">
        <div className="relative overflow-hidden">
        <p className='text-xl w-full mx- mt-6 mb-5 font-custom'>
          Creative Learning Made Easy
        </p>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {carouselItems.map((item, index) => (
              <div key={index} className="min-w-full relative">
                <img src={item.src} alt={`Slide ${index + 1}`} className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
                  {item.title}
                </div>
              </div>
            ))}

            <div key={carouselItems.length} className="min-w-full relative">
              <img src={carouselItems[0].src} alt={`Slide 1`} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
                {carouselItems[0].title}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
          style={{ zIndex: 10 }}
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg"
          style={{ zIndex: 10 }}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
