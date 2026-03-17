// import  { useState } from "react";
import { FaUserEdit, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "./Header";
import {  useDispatch, useSelector } from "react-redux";
import Sidebar from "../userPages/Sidebar";
import Axios from "axios";
import { UploadImageStudent } from "../../utils/Axios/api";
// import { UseDispatch } from "react-redux";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";
import { toast } from "react-toastify";
import { useError } from "./ErrorBoundary";
import { MdAlternateEmail } from "react-icons/md";

const Profile = () => {
  const { userInfo } = useSelector((state: any) => state.userAuth);
  // const [imageSelected, setImageSelected] = useState("");
  const dispatch = useDispatch();
  const throwError = useError();

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };
  const handleFileChange = async (files: any) => {
    console.log(files[0]);
    const image = files[0];
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ADHYAYA");
    Axios.post(
      "https://api.cloudinary.com/v1_1/dixhsgyfj/image/upload",
      formData
    ).then(async (response: any) => {
      console.log(response.data.url);

      if (response.data.url) {
        try {
          const data = response.data.url;
          const profileImage = await UploadImageStudent({
            profileImage: data,
          });
          console.log(profileImage, "profileImage");
          if (profileImage) {
            dispatch(setUserDetails(profileImage.data));
            toast.success("Profile Updated");
          }
        } catch (error: any) {
          const message = error.response.data.message;
          console.log(error, "erorrorororr");
          throwError(message);
          toast.error("Something went wrong");
        }
      }
    });
  };

  const user = {
    name: userInfo.name,
    email: userInfo.email,
    contact: userInfo.contact,
    profilePic: userInfo.profileImage
      ? userInfo.profileImage
      : "https://via.placeholder.com/150",
  };
  return (
    <>
      <Header />
      <div className="flex overflow-y-hidden ">
        <Sidebar />
        <div className="flex justify-center items-center w-full     bg-gray-100">
          <div className="flex-1 flex justify-center items-center bg-white p-12 ">
            <div className="bg-white shadow-2xl rounded p-9 w-full max-w-md animate-dropIn">
              <h1 className="text-2xl font-semibold mb-6 text-center">
                Profile
              </h1>
              <div className="relative flex flex-col items-center mb-4">
                <img
                  src={user?.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />

                <FaUserEdit
                  className="absolute bottom-2 ml-11 text-gray-500 bg-white rounded-full p-1"
                  size={24}
                  onClick={handleClick}
                />
                <input
                  type="file"
                  name="file"
                  id="fileInput"
                  onChange={(e) => handleFileChange(e.target.files)}
                  hidden
                />
              </div>
              <div className="mb-4 text-center ">
                <p className="font-medium mt-2">Name: {user.name}</p>
                <p className=" font-medium mt-2">Email: {user.email}</p>
                <p className=" font-medium mt-2">Contact: {user.contact}</p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="group relative inline-block gap-4  ">
                  <Link
                    to={"/updateProfile"}
                    className="bg-gradient-to-br from-red-600 to-pink-500 text-white  px-2 py-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  >
                    <FaUserEdit className="" />
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs bg-black w-auto text-white px-4 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Edit Profile
                    </span>
                  </Link>
                </div>

                <div className="group relative inline-block">
                  <Link
                    to={"/updateEmail"}
                    className="bg-gradient-to-br from-red-600 to-pink-500 text-white  px-2 py-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110"
                  >
                    <MdAlternateEmail className="" />
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs bg-black w-auto text-white px-4 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Update Email
                    </span>
                  </Link>
                </div>

                {!userInfo.googleUserId && (
                  <div className="group relative inline-block">
                    <Link
                      to="/changepassword"
                      className="bg-gradient-to-br from-red-600 to-pink-500 text-white px-2 py-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    >
                      <FaLock className="" />
                      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 text-xs bg-black w-auto text-white px-4 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Change Password
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
