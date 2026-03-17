import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../utils/redux/slices/adminAuthSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminInfo } = useSelector((state: any) => state.adminAuth);

  console.log(adminInfo);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const LogoutUser = () => {
    console.log("clearing admininfo");
    dispatch(logoutAdmin(null));
    navigate("/admin/login");
  };

  return (
    <>
      <div className="h-14 w-full bg-gradient-to-br from-red-600 to-pink-500 flex items-center justify-between px-4 lg:px-20">
        <div>
          <p className="text-white font-custom text-xl lg:text-2xl">ADHYAYA</p>
        </div>
        <div className="flex items-center">
          <div className="flex gap-4 lg:gap-10 items-center ml-auto p-6 ">
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

export default Header;
