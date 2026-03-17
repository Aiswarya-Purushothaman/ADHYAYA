import { useState } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../utils/redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { LogoutStudent } from "../../helpers/Logout";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: any) => state.userAuth);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const LogoutUser = () => {
    console.log("clearing studentinfo");
    const userId = userInfo._id
    socket.emit('userOffline',{userId:userId})
    LogoutStudent(dispatch)

    navigate("/login");
  };
  const handlecart = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="h-14 w-full bg-gradient-to-br from-red-600 to-pink-500 flex items-center justify-between px-4 lg:px-20 overflow-y: auto ">
        <div>
          <p className="text-white font-custom text-xl lg:text-2xl">ADHYAYA</p>
        </div>
        <div className="flex items-center">
          <div className="hidden lg:flex gap-6 lg:gap-20 justify-center items-center mr-36">
            <Link to={"/"} className="text-white font-semibold hover:underline transition-transform duration-300 hover:scale-110">
              Home
            </Link>
            <Link
              className="text-white font-semibold hover:underline transition-transform duration-300 hover:scale-110"
              to="/courses"
            >
              Courses
            </Link>
            <Link
              className="text-white font-semibold hover:underline transition-transform duration-300 hover:scale-110"
              to="/tutors"
            >
              Tutors
            </Link>
          </div>

          <div className="flex gap-4 lg:gap-10 items-center ml-auto p-6 ">
            {userInfo ? (
              <div className="flex gap-12">
                <Link to={"/chatuser"}>
                <IoChatbubblesOutline
                  size={24}
                  className="text-white  transition-transform duration-300 hover:scale-110"
                />
                </Link>
               
                <HiShoppingCart
                  size={24}
                  className="text-white  transition-transform duration-300 hover:scale-110"
                  onClick={handlecart}
                />
              </div>
            ) : (
              ""
            )}

            <div className="relative">
              <p
                className="text-xl lg:text-2xl text-white font-semibold cursor-pointer transition-transform duration-300 hover:scale-110 "
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
              >
                ☰
              </p>
              {dropdownVisible && (
                <div
                  className="absolute mb-30 right-0  w-48 bg-white rounded-md shadow-lg py-2 z-50"
                  onMouseEnter={() => setDropdownVisible(true)}
                  onMouseLeave={() => setDropdownVisible(false)}
                >
                  {userInfo ? (
                    <>
                      <Link
                        to={"/profile"}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 "
                      >
                        Profile
                      </Link>
                      <p
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 "
                        onClick={LogoutUser}
                      >
                        Logout
                      </p>
                    </>
                  ) : (
                    <Link
                      to={"/login"}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
