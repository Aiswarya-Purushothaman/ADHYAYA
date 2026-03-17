import React from 'react';
import "../../style/home1.css";
import { Link } from 'react-router-dom';

const Home1 = () => {
  console.log('home1')
  return (
    <>
      <div className='px-16 py-3'>
        <div className='flex justify-center gap-16 shadow-2xl w-full h-full rounded-xl home-orbit'>
          <div className="w-full p-6 flex flex-col items-center">
            <p className="text-2xl mt-12 font-custom text-center">
              Don't Wait For The Opportunities {">>>"}
            </p>
            <p className="text-2xl mt-1 font-custom text-center">
             Lets Create It
            </p>
            <p className="text-sm p-6 mt-4 text-center max-w-lg">
            ADHYAYA is the most used e-learning platform worldwide. 
            This platform covers over 180 courses, providing extensive educational
             resources to learners across the globe. It also provides certifications 
             for students, helping them validate their skills and knowledge. Use this
              website for a brighter career and unlock new opportunities for growth and success.
            </p>


            <Link 
  to="/instructor/register" 
  className='bg-gradient-to-br from-red-600 to-pink-500 h-10 mt-10 w-64 font-custom text-lg rounded-lg text-white flex items-center justify-center hover:underline transition-transform duration-300 hover:scale-110'>
  Become Instructor
</Link>
         
            
          </div>

          <div className='w-full flex justify-center mb-5'>
            <img className='h-96 mt-12 ml-5  mx-10 rounded-xl' src="https://img.freepik.com/premium-photo/computer-screen-with-light-bulb-it-picture-light-bulb_1103290-22259.jpg" alt="no pic" />
          </div>
        </div>
      </div>

      
    </>
  );
}

export default Home1;
