import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "../../style/sidebar.css";

const InstSidebar = () => {
  const { instructorInfo } = useSelector((state: any) => state.instructorAuth);
  const location = useLocation()

  const instructor = {
    name: instructorInfo.name,
    email: instructorInfo.email,
    contact: instructorInfo.contact,
    description:instructorInfo.description,
    profilePic: instructorInfo.profileImage ||"https://via.placeholder.com/150" 
  };

  return (
    <div className="w-64  bg-white border-2 p-2  ">
      <div className="flex flex-col items-center ">
        <img
          src={instructor.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold mb-4">{instructor.name}</h2>
      </div>
      <nav className="flex flex-col space-y-2">
        <Link
          to="/instructor/profile"
          className={`${location.pathname==='/instructor/profile'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Profile
        </Link>
        <Link
          to="/instructor/courses"
          className={`${location.pathname==='/instructor/courses'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Tutorials
        </Link>
        <Link
          to="/instructor/students"
          className={`${location.pathname==='/instructor/students'||location.pathname==='/instructor/students/studentsDetails'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Students
        </Link>
        <Link
          to="/instructor/addcourse"
          className={`${location.pathname==='/instructor/addcourse'||location.pathname==='/instructor/addcourse2'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Add Course
        </Link>
        
        <Link
          to=""
          className="bg-gray-200 font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default InstSidebar;
