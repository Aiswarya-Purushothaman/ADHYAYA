import  { useEffect, useState } from "react";
import Header from "./Header";
import "../../style/userCourses.css";
import { RiDropdownList } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { MdLocationSearching } from "react-icons/md";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { addCart, userFetchCourse, addSaved } from "../../utils/Axios/api";
import { Course } from "../../utils/types";
import { toast } from "react-toastify";
import { ObjectId } from "mongoose";
import CourseDetails from "./Coursedetails";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useError } from "./ErrorBoundary";
import { setUserDetails } from "../../utils/redux/slices/userAuthSlice";
import { Paginate } from "../../helpers/paginate";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Search } from "../../helpers/search";
import LoadingSpinner from "../../helpers/Loader";


const Courses = () => {
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const coursesPerPage = 6;

  const { userInfo } = useSelector((state: any) => state.userAuth);
  const throwError = useError();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSaved = async (id: ObjectId) => {
    if (userInfo) {
      let match = false;
      userInfo.saved.forEach((course: any) => {
        if (course.courseId._id === id) {
          match = true;
        }
      });

      if (match) {
        toast.error("Item already saved");
        return;
      }

      try {
        const response = await addSaved({ id: id });
        if (response.data) {
          dispatch(setUserDetails(response.data));
          toast.success("Item saved");
        }
      } catch (error:any) {
        const message = error?.response?.data?.message;
        throwError(message);
        toast.error("Error saving item");
      }
    } else {
      navigate("/login");
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
        toast.error("Item already purchased");
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
      }

      try {
        const response = await addCart({ id: id });
        if (response.data) {
          dispatch(setUserDetails(response.data));
          toast.success("Item added to cart");
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;
        throwError(message);
        toast.error("Error adding item to cart");
      }
    } else {
      toast.warn("Login in to your account first")
      navigate("/login");
    }
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
  };

  const handleBackClick = () => {
    setSelectedCategory("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchUserCourse = async () => {
      try {
        setIsLoading(true)
        const response = await userFetchCourse();
        const MyCourse = response.data;

        const approved = MyCourse.filter(
          (course: { isApproved: string }) => course.isApproved === "approved"
        );

        const filteredCourses = Search(
          approved,
          searchQuery,
          "title",
          "category"
        );

        const uniqueCategories = [
          ...new Set(approved.map((course: Course) => course.category)),
        ] as string[];
        setCategories(uniqueCategories);

        const { totalPages, currentCourses } = Paginate(
          filteredCourses,
          currentPage,
          coursesPerPage
        );

        setPages(totalPages);
        setApprovedCourses(currentCourses);
        setIsLoading(false)
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error,"erorrorororr");
        throwError(message)
        toast("something went wrong")
      }
    };

    fetchUserCourse();
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    const filterCourses = () => {
      if (selectedCategory) {
        const courses = approvedCourses.filter(
          (course: { category: string }) => course.category === selectedCategory
        );
        setFilteredCourses(courses);
      } else {
        setFilteredCourses(approvedCourses);
      }
    };

    filterCourses();
  }, [approvedCourses, selectedCategory]);

  return (
    <>
      <Header />
      <div className="h-screen overflow-auto w-full items-center p-1 shadow-lg">
        <div className="h-2/4 bg-orbit1">
          <div className="search-filter-container items-center">
            <div className="search-box w-96 mt-24 shadow-2xl rounded-xl">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <div className="mt-28 mr-2">
              <button className="bg-gradient-to-br from-red-600 to-pink-500 p-2 rounded-3xl">
                <RiDropdownList className="text-white hover:text-black" />
              </button>
            </div> */}
          </div>   
          <div className="orbit2"></div>
          <div className="top-right-circle"></div>
        </div>
        <div className="bottom-line"></div>

        {selectedCourse ? (
          <CourseDetails course={selectedCourse} onCancel={handleCancel} />
        ) : (
          <div>
            <div className="p-4">
              <div className="category-container">
                {selectedCategory && (
                  <button
                    className={`category-button back-button font-bold bg-slate-700 `}
                    onClick={handleBackClick}
                  >
                    {"<<<"}
                  </button>
                )}
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`category-button ${
                      selectedCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {isLoading ? (
            
            <LoadingSpinner />
          ) : (<div className="course-cards-container flex flex-wrap justify-center gap-10 mt-2 mb-5 ">
            {filteredCourses.length === 0 ? (
              <div className="text-center text-gray-600 mt-10 w-full">
                No courses found.
              </div>
            ) : (
              filteredCourses.map((course, index) => (
                <div
                  key={index}
                  className={`h-76 w-80 p-2 rounded-lg shadow-lg relative ${
                    (index + 1) % 3 === 0 ? "mr-0" : "mr-4"
                  } mb-4`}
                >
                  <img
                    className="object-cover object-center h-44 rounded-md w-full"
                    src={course.thumbnail}
                    alt={course.title}
                  />
                  <div className="course-title font-bold text-xl mb-2">
                    {course.title}
                  </div>

                  <div className="course-details text-sm mb-2">
                    {course.level} | {course.category}
                  </div>
                  <div className="course-details text-sm mb-2">
                    {course.duration} Hours
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="course-price font-bold text-lg">
                      ₹{course.price}
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button className="bg-gradient-to-br from-red-600 to-pink-500 text-white py-1 px-4 rounded-md transition-transform duration-300 hover:scale-110">
                        <FaShoppingCart
                          onClick={() => handleAddCart(course._id)}
                          className="text-white text-xl  cursor-pointer"
                        />
                      </button>
                      <button className="bg-gradient-to-br from-red-600 to-pink-500 text-white py-1 px-4 rounded-md transition-transform duration-300 hover:scale-110">
                        <MdLocationSearching
                          className="text-white text-xl  cursor-pointer"
                          onClick={() => handleViewCourse(course)}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <BsFillBookmarkStarFill
                      className="text-white text-3xl hover:text-pink-600 cursor-pointer transition-transform duration-300 hover:scale-110"
                      onClick={() => handleSaved(course._id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>)}
            
            <div className="flex justify-center items-center mb-20">
              {pages > 1 && (
                <div className="flex justify-center items-center mb-20">
                  <Stack spacing={2}>
                    <Pagination
                      count={pages}
                      page={currentPage}
                      onChange={(_event, value) => setCurrentPage(value)}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Courses;
