import React from 'react';
import "../../style/home.css"; 

const MainHome = () => {
  
  return (
    <>
    <div className='p-10 '>
      <div className='bg-gradient-to-br from-red-600 to-pink-500 h-full rounded-md w-full relative home flex  justify-content'>
     <div className='mt-16 p-10  mx-20'>
    <p className='text-4xl font-bold text-white'>
      Start Learning & 
    </p>
    <p className='text-4xl mt-2 font-bold text-white'>Start Define Your Future</p>
    <p className='text-white mt-8 w-96'>
      Learn Easily Anytime & Anywhere From The Best Tutors & Gain Unlimited Access To A Large Collection Of Materials
    </p>
    <div className='flex justify-content gap-4 mt-14 '>
    <button className=' text-white  px-16 p-3 font-bold rounded-lg border border-white hover:bg-white hover:text-red-700  transition-transform duration-300 hover:scale-110'>Get Started</button>
    <button className=' text-white px-16 p-3 font-bold rounded-lg border border-white hover:bg-white hover:text-red-700 transition-transform duration-300 hover:scale-110'>Learn More</button>
    </div>


     </div>
    
        <div>
        <img
          src="https://img.freepik.com/premium-photo/female-informal-meeting-conference-room-using-laptop-top-books-flat-design-image_117038-63052.jpg"
          alt="Your Image"
          className="absolute right-7 md:right-36 top-1/2 md:top-60 h-36 md:h-60 w-36 md:w-60 rounded-full transform -translate-y-1/2  transition-transform duration-300 hover:scale-110 z-10 "
        />
        </div>
       
      </div>
    </div>
    </>
    
  );
}

export default MainHome;
