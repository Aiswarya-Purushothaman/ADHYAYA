import { Link } from "react-router-dom";
import InstHeader from "./instHeader";
import { FetchCourses, fetchMyEnroll, fetchMyStudents } from "../../utils/Axios/api";
import { SetStateAction, useEffect, useState } from "react";
import { Course } from "../../utils/types";
import { toast } from "react-toastify";
import { useError } from "./InstErrorBoundary";
import { MdEditDocument } from "react-icons/md";
import CourseDetails from "./CourseDetails";
import '../../style/home.css'
import { Paginate } from "../../helpers/paginate";
import { Pagination, Stack } from "@mui/material";
import LoadingSpinner from "../../helpers/Loader";

const InstHome = () => {
  const [approvedCourses, setApprovedCourses] = useState<Course[] >([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseCount, setCourseCount] = useState(0);
const [studentCount, setStudentCount] = useState(0);
const [salesCount, setSalesCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [isLoading, setIsLoading] = useState(false);
const [pages, setPages] = useState(0);
const coursesPerPage = 8;

  const throwError = useError();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true)
        const students = await fetchMyStudents();
        const myEnroll = await fetchMyEnroll();
        const response = await FetchCourses();
        const myCourses = response.data;
  
        const approved:any = myCourses.filter(
          (course: { isApproved: string }) => course.isApproved === "approved"
        );

        const { totalPages, currentCourses } = Paginate(
          approved,
          currentPage,
          coursesPerPage
        );
        setPages(totalPages);
        setApprovedCourses(currentCourses);
        setCourseCount(approved?.length);
        setStudentCount(students?.data?.length);
        setSalesCount(myEnroll?.data);
        setIsLoading(false)
      } catch (error: any) {
        const message = error?.response?.data?.message;
        throwError(message);
        toast.error("Something went wrong");
      }
    };
  
    fetchCounts();
  }, [currentPage]);


  // useEffect(() => {
  //   const { totalPages, currentCourses } = Paginate(filteredStudents, currentPage, studentsPerPage);
  //   setPaginatedCourses(currentCourses);
  //   setPages(totalPages);
  // }, [filteredStudents, currentPage]);

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  const renderSticker = (type: string) => {
    let bgColor = "";
    let text = "";

    switch (type) {
      case "requested":
        bgColor = "bg-yellow-500";
        text = "Requested";
        break;
      case "approved":
        bgColor = "bg-green-500";
        text = "Approved";
        break;
      case "rejected":
        bgColor = "bg-red-500";
        text = "Rejected";
        break;
      default:
        bgColor = "bg-gray-500";
        text = "Unknown";
        break;
    }

    return (
      <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white ${bgColor} rounded`}>
        {text}
      </span>
    );
  };

  return (
    <>
    <InstHeader />
    {isLoading ? (
            
            <LoadingSpinner />
          ) : (
<div className="h-full main-content pb-20">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
      <Link to={"/instructor/courses"}>
        <h2 className="text-xl font-bold mb-4 ">Courses</h2>
        <p>Total Courses: {courseCount}</p>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Earning</h2>
        <p>Total Sales: {salesCount}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 ">
        <Link to={"/instructor/students"}>
        <h2 className="text-xl font-bold mb-4 ">Students</h2>
        <p>Total Students: {studentCount} </p>
        </Link>
        
      </div>
    </div>
    <div className="flex justify-center p-4 gap-3">
     
      <button className="bg-gradient-to-br from-red-600 to-pink-500 text-white p-3 rounded-lg mt-5 transition-transform duration-300 hover:scale-110  ">
        <Link to="/instructor/addcourse">Add Course</Link>
      </button>

     
    </div>
    <div className="p-6 ">
    <p className="text-2xl font-semibold mb-5">
        Streaming Courses
      </p>
    {selectedCourse ? (
      <CourseDetails course={selectedCourse} onCancel={handleBack} />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 overflow-x-auto ">
        {approvedCourses.map((course, index) => (
          <div
            key={index}
            className="w-64 p-4 shadow-lg rounded-lg border relative flex flex-col justify-between"
          >
            {renderSticker(course.isApproved)}
            <div>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-32 object-cover rounded-md"
              />
              <h3 className="font-bold mt-2">{course.title}</h3>
              <p className="text-gray-400 text-sm">{course.description}</p>
              <p className="font-bold">₹{course.price}</p>
            </div>
            <div className="flex justify-between gap-3 mt-4">
              <button
                onClick={() => handleViewDetails(course)}
                className="bg-gradient-to-br from-red-600 to-pink-500 text-white py-2 px-4 rounded transition-transform duration-300 hover:scale-110"
              >
                View Details
              </button>
              <Link
                to={`/instructor/editCourse/${course._id}`}
                className="bg-gradient-to-br from-red-600 to-pink-500 text-white py-2 px-4 rounded transition-transform duration-300 hover:scale-110 flex items-center justify-center"
              >
                <MdEditDocument />
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
    <div className="flex justify-center items-center mb-20 mt-10  h-10">
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
    
   
    
    
  </>
  
  );
};

export default InstHome;
