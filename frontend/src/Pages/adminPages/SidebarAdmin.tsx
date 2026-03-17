import React from "react";
import "../../style/sidebar.css";

import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../utils/redux/slices/adminAuthSlice";

const SidebarAdmin = () => {

  
  const { adminInfo } = useSelector((state: any) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const LogoutUser = () => {
    console.log("clearing admininfo");
    dispatch(logoutAdmin(null));
    navigate("/admin/login");
  };

  return (
    <div className="w-64  bg-white border-2 h-screen p-2  ">
      <nav className="flex flex-col space-y-2">
     
        <Link
          to="/admin/dashboard"
          className={`${location.pathname==='/admin/dashboard'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          DashBoard
        </Link>
        <Link
          to="/admin/students"
          className={`${location.pathname==='/admin/students'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Students
        </Link>
        <Link
          to="/admin/instructors"
          className={`${location.pathname==='/admin/instructors'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Instructors
        </Link>
        <Link
          to="/admin/courses"
          className={`${location.pathname==='/admin/courses'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Courses
        </Link>
       
        <Link
          to="/admin/permissions"
          className={`${location.pathname==='/admin/permissions'? 'bg-gradient-to-br from-red-600 to-pink-500 text-white':'bg-gray-200'}  font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center`}
        >
          Permissions
        </Link>
        <Link
          to=""
          className="bg-gray-200 font-bold hover:bg-gradient-to-br from-red-600 to-pink-500 hover:text-white transition-colors p-2 rounded text-center "
          onClick={LogoutUser}
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
