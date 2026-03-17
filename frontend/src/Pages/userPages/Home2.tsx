import React, { useEffect, useState } from 'react';
import { addCart, userFetchCourse } from '../../utils/Axios/api';
import { Course } from '../../utils/types';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import { MdLocationSearching } from 'react-icons/md';
import { ObjectId } from 'mongoose';
import { Link, useNavigate } from 'react-router-dom';
import CourseDetails from './Coursedetails';
import { useDispatch, useSelector } from 'react-redux';
import { useError } from './ErrorBoundary';
import { setUserDetails } from '../../utils/redux/slices/userAuthSlice';
import LoadingSpinner from '../../helpers/Loader';

const Home2 = () => {
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { userInfo } = useSelector((state: any) => state.userAuth);

  const [isLoading,setIsLoading]=useState(false)

  const throwError = useError();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddCart = async (id: ObjectId) => {
    if (userInfo) {
      console.log(id, "(course._id)(course._id)");

      let enrolled=false
      userInfo.enrollments.map((course:any)=>{
       console.log(course, "added course check");
       if(course===id){
         enrolled=true
         console.log(enrolled); 
       }
      })
      if(enrolled){
       toast.error("item already Purchased");
         return;
      }


      let match = false;
      userInfo.cart.map((course: any) => {
        console.log(course, 'added course');
        if (course.courseId._id === id) {
          console.log('should match');
          match = true;
          console.log(match);
        }
      });
      console.log(match, "matchhhhhhh");

      if (match) {
        toast.error("Item already exists in cart");
        return;
      } else {
        try {
          const response = await addCart({ id: id });
          console.log(response.data);
          if (response.data) {
            dispatch(setUserDetails(response.data));
            toast.success("Item added to cart");
          }
        } catch (error: any) {
          console.log(error);
          const message = error?.response?.data?.message;
          console.log(error, "erorrorororr");
          throwError(message);
          toast.error("Item already exists in cart");
        }
      }
    } else {
      toast.warn("Login in to your account first")
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        // setIsLoading(true)
        const response = await userFetchCourse();
        console.log(response)
        const MyCourse = response.data;
        console.log(MyCourse, "MyCourseMyCourse");
      

        const approved = MyCourse.filter(
          (course: { isApproved: string }) => course.isApproved === "approved"
        );
        
        setApprovedCourses(approved);
        setIsLoading(false)
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "erorrorororr");
        console.log(message)
        throwError(message);
        console.error(error);
        toast.error("Something went wrong");
      }
    }

    fetchUserCourse();
  }, []);

  return (
    <div className="w-full h-96 overflow-y:auto flex flex-col py-5">
      <div className="flex justify-between items-center px-12">
        <h2 className="text-2xl font-bold text-zinc-600">Explore More</h2>
        <Link to={"/courses"} className="text-red-black font-semibold bg-white p-1 px-5 border-2 border-red-400 rounded-md shadow-2xl hover:underline">See More</Link>
      </div>

      
      {isLoading ? (
            
            <LoadingSpinner />
          ) : (
            <div className="flex justify-center items-center h-full gap-4 overflow-x-auto p-5">
 {approvedCourses.slice(0, 5).map(course => (
              <div
                key={course._id.toString()}
                className="group w-56 h-72 rounded-lg p-3 shadow-2xl border-2 flex flex-col justify-between transform transition-transform duration-300 hover:scale-110"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 left-0 m-2 bg-gradient-to-br from-red-600 to-pink-500 text-white p-1 rounded-md"
                    onClick={() => handleAddCart(course._id)}
                  >
                    <FaShoppingCart className="text-white text-lg hover:text-black cursor-pointer" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-gray-400 text-sm">{course.level}{" | "}{course.category}</p>
                  <p className="font-bold">{"₹"}{course.price}</p>
                </div>
                <div className="flex gap-2 mx-40">
                 
                </div>
              </div>
            ))}
            </div>
           
          )}
        
      </div>
   
  );
};

export default Home2;
