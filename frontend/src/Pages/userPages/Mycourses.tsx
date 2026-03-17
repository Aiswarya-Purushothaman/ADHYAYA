import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { fetchMycourses } from '../../utils/Axios/api';
import { useError } from './ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const Mycourses = () => {
  const throwError = useError();
  const { userInfo } = useSelector((state: any) => state.userAuth);
  console.log(userInfo);
  const naviagte=useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('enrolled');
  

  const HandleView=async(id: any)=>{
console.log(id,"idididi");
naviagte(`/WatchCourse/${id}`)
  }

  useEffect(() => {
    const FetchMyUserCourse = async () => {
      try {
        const response = await fetchMycourses();
        
        console.log(response.data, "enrolled courses");

        const enrolled = response.data.filter((course: { isCompleted: boolean }) => !course.isCompleted);
        const completed = response.data.filter((course: { isCompleted: boolean }) => course.isCompleted);

        setEnrolledCourses(enrolled);
        setCompletedCourses(completed);




      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "error");
        throwError(message);
      }
    };

    FetchMyUserCourse();
  }, [userInfo._id, throwError]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };


  return (
    <>
      <Header />
      <div className="flex overflow-y-hidden ">
        <Sidebar />
        <div className="flex-grow flex flex-col mb-20 p-10 ">
          <div className="flex justify-center gap-2 mb-4 ">
            <button
              onClick={() => handleTabClick('enrolled')}
              className={`px-4 py-2 ${selectedTab === 'enrolled' ? 'bg-yellow-500 text-white rounded-md' : 'bg-gray-200 rounded-md'}`}
            >
              Enrolled
            </button>
            <button
              onClick={() => handleTabClick('completed')}
              className={`px-4 py-2 ${selectedTab === 'completed' ? 'bg-green-500 text-white rounded-md' : 'bg-gray-200 rounded-md'}`}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-wrap gap-4 animate-dropIn ">

            {(selectedTab === 'enrolled' ? enrolledCourses : completedCourses).map((course: any) => (
              <div key={course._id} className="w-64 p-4 shadow-lg rounded-lg border relative">
                <img src={course.courseId.thumbnail} alt={course.courseId.title} className="w-full h-32 object-cover rounded-md" onClick={()=>HandleView(course.courseId._id)} />
                <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded ${selectedTab === 'enrolled' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                  {selectedTab === 'enrolled' ? 'Enrolled' : 'Completed'}
                </div>
                <h3 className="font-bold mt-2">{course.courseId.title}</h3>
                <p className="text-gray-400 text-sm">{course.courseId.level} | {course.courseId.category}</p>
                <p className="font-bold">₹{course.courseId.price}</p>
                <p className="text-sm">{course.courseId.duration} hours</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mycourses;
