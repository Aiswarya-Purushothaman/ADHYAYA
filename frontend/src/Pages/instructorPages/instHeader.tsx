import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutinst } from "../../utils/redux/slices/instructorAuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { LogoutInstructor } from "../../helpers/Logout";
import { IoChatbubblesOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const InstHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { instructorInfo } = useSelector((state: any) => state.instructorAuth);

  console.log(instructorInfo);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const LogoutUser = () => {
    console.log("clearing instinfo");
    const userId = instructorInfo._id
    socket.emit('userOffline',{userId:userId})
    LogoutInstructor(dispatch)
    // dispatch(logoutinst(null));
    navigate("/instructor/login");
  };

  return (
    <>
      <div className="h-14 w-full bg-gradient-to-br from-red-600 to-pink-500 flex items-center justify-between px-4 lg:px-20">
        <div>
          <p className="text-white font-custom text-xl lg:text-2xl">ADHYAYA</p>
        </div>
        <div className="flex items-center">
          <div className="flex gap-4 lg:gap-10 items-center ml-auto p-6 ">
          <Link to={"/instructor/dashboard"}>
                <AiFillHome
                  size={24}
                  className="text-white  transition-transform duration-300 hover:scale-110"
                />
                </Link>
          <Link to={"/instructor/chat"}>
                <IoChatbubblesOutline
                  size={24}
                  className="text-white  transition-transform duration-300 hover:scale-110"
                />
                </Link>
            <div className="relative">
              <p
                className="text-xl lg:text-2xl text-white font-semibold cursor-pointer"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
              >
                ☰
              </p>
              {dropdownVisible && (
                <div
                  className="absolute right-0  w-48 bg-white rounded-md shadow-lg py-2 "
                  onMouseEnter={() => setDropdownVisible(true)}
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                  <Link
                    to="/instructor/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Profile
                  </Link>
                  <p
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 "
                    onClick={LogoutUser}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default InstHeader;
