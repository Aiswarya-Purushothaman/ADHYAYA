import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import "../../style/sidebar.css";

const Sidebar = () => {
  const { userInfo } = useSelector((state: any) => state.userAuth);

  const user = {
    name: userInfo.name,
    email: userInfo.email,
    contact: userInfo.contact,
    profilePic: userInfo.profileImage || "https://via.placeholder.com/150",
  };
  const location = useLocation()

  return (
    <div className="w-64  bg-white border-2 p-2  ">
      <div className="flex flex-col items-center ">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-xl font-semibold mb-4">{user.name}</h2>
      </div>
      <nav className="flex flex-col space-y-2">
      <Link
          to="/profile"
          className={`${location.pathname==='/profile'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Profile
        </Link>
        <Link
          to="/mycourses"
          className={`${location.pathname==='/mycourses'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          My Courses
        </Link>
        <Link
          to=""
          className="bg-gray-200 font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center"
        >
          Certifications
        </Link>
        <Link
          to="/saved"
          className={`${location.pathname==='/saved'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Saved
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
