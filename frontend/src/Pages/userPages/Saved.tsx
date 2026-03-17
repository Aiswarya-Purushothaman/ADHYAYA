import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { addCart, removeSavedCourse } from "../../utils/Axios/api";
import { ObjectId } from "mongoose";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";
import { toast } from "react-toastify";
import { useError } from "./ErrorBoundary";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Paginate } from "../../helpers/paginate";
import { MdLocationSearching } from "react-icons/md";
import { Course } from "../../utils/types";
import CourseDetails from "./Coursedetails";

const Saved = () => {
  const { userInfo } = useSelector((state: any) => state.userAuth);
  const dispatch = useDispatch();
  const throwError = useError();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedCourses, setPaginatedCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const coursesPerPage = 8;

  const handleRemove = async (id: ObjectId) => {
    try {
      const response = await removeSavedCourse({ id });
      if (response && response.data && response.data.saved) {
        dispatch(setUserDetails(response.data));
        toast.success("Removed from saved");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      throwError(message);
    }
  };

  const handleAddCart = async (id: ObjectId) => {
    if (userInfo) {
      let enrolled = false;
      userInfo.enrollments.forEach((course: any) => {
        if (course === id) {
          enrolled = true;
        }
      });
      if (enrolled) {
        toast.error("Item already Purchased");
        return;
      }

      let match = false;
      userInfo.cart.forEach((course: any) => {
        if (course.courseId._id === id) {
          match = true;
        }
      });

      if (match) {
        toast.error("Item already exists in cart");
        return;
      } else {
        try {
          const response = await addCart({ id: id });
          if (response.data) {
            dispatch(setUserDetails(response.data));
            toast.success("Item added to cart");
          }
        } catch (error: any) {
          const message = error?.response?.data?.message;
          throwError(message);
          toast.error("Item already exists in cart");
        }
      }
    } else {
      navigate("/login");
    }
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
  };

  useEffect(() => {
    const { totalPages, currentCourses } = Paginate(
      userInfo.saved,
      currentPage,
      coursesPerPage
    );
    setPaginatedCourses(currentCourses);
  }, [userInfo.saved, currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <>
    <Header />
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow flex flex-col mb-20 p-10 border-2 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Saved Courses</h2>
        {selectedCourse ? (
          <CourseDetails course={selectedCourse} onCancel={handleCancel} />
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 animate-dropIn">
              {paginatedCourses.length === 0 ? (
                <div className="text-center text-gray-600 mt-10 w-full">
                  No courses found.
                </div>
              ) : (
                paginatedCourses.map((savedItem: any) => (
                  <div
                    key={savedItem?._id}
                    className="w-64 p-4 shadow-lg rounded-lg border flex flex-col justify-between relative"
                  >
                    <div className="relative">
                      <img
                        src={savedItem?.courseId?.thumbnail}
                        alt={savedItem?.courseId?.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                       <button
                          className="absolute top-0 left-0 m-2 mx-48 bg-gradient-to-br from-red-600 to-pink-500 text-white p-1 rounded-md transition-transform duration-300 hover:scale-110"
                          onClick={() => handleAddCart(savedItem?.courseId?._id)}
                        >
                          <FaShoppingCart className="text-white text-lg cursor-pointer" />
                        </button>
                        <button
                          className="absolute top-0 left-0 m-2 mx-40 bg-gradient-to-br from-red-600 to-pink-500 text-white p-1 rounded-md transition-transform duration-300 hover:scale-110"
                          onClick={() => handleViewCourse(savedItem?.courseId)}
                        >
                          <MdLocationSearching className="text-white text-lg cursor-pointer" />
                        </button>
                    
                    
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded bg-blue-500 text-white">
                      Saved
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold">{savedItem?.courseId?.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {savedItem?.courseId?.level} |{" "}
                        {savedItem?.courseId?.category}
                      </p>
                      <p className="font-bold">₹{savedItem?.courseId?.price}</p>
                      <p className="text-sm">{savedItem?.courseId?.duration} hours</p>
                    </div>
                    <button
                      onClick={() => handleRemove(savedItem?.courseId?._id)}
                      className="mt-2 bg-red-700 text-white px-2 py-1 rounded hover:bg-red-900 transition-transform duration-300 hover:scale-110 self-start"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            {paginatedCourses.length > 0 && (
              <div className="flex justify-center items-center mt-6">
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(userInfo.saved.length / coursesPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </Stack>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </>
  );
};

export default Saved;
