import React, { useEffect, useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";
import { approveCourse, fetchAllcourses, rejectCourse } from "../../utils/Axios/api";
import { Course } from "../../utils/types";
import CourseDetails from "../adminPages/CourseDetails";
import { ObjectId } from "mongoose";
import { toast } from "react-toastify";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Paginate } from "../../helpers/paginate";

const Permissions = () => {
  const [requestedCourses, setRequestedCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);
  const studentsPerPage = 6
  const [paginatedCourse, setPaginatedCourse] = useState<any>([]);

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
  };

  const handleApprove = async(courseId: ObjectId) => {
    console.log(courseId);

    try {
      const response = await approveCourse({ id: courseId });
      console.log(response.data);
      if (response.data) {
        toast.success("Course Approved");
        setRequestedCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
        fetchCourses();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReject =async (courseId: ObjectId) => {
    console.log(courseId);
    try {
      const response = await rejectCourse({ id: courseId });
      if (response.data) {
        toast.success("Course Rejected");
        setRequestedCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
        fetchCourses();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetchAllcourses();
      const theCourses = response.data;
      const requested = theCourses.filter(
        (course: any) => course.isApproved === "pending"
      );
      console.log(requested, "requested");

      const { totalPages, currentCourses } = Paginate(requested, currentPage, studentsPerPage);
      setRequestedCourses(requested);
      setPaginatedCourse(currentCourses);
      setPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  return (
    <>
  <Header />
  <div className="flex h-full">
    <SidebarAdmin />
    <div className="w-screen p-2 flex flex-col items-center h-full overflow-y-auto">
      {selectedCourse ? (
        <CourseDetails course={selectedCourse} onCancel={handleCancel} />
      ) : (
        <div className="bg-white w-full rounded-lg shadow-xl p-4">
          {loading ? (
            <p>Loading...</p>
          ) : paginatedCourse.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-dropIn">
              {paginatedCourse.map((course: any, index: any) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-xl flex flex-col justify-between">
                  <div>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-md cursor-pointer"
                      onClick={() => handleViewCourse(course)}
                    />
                    <h2 className="text-lg font-bold mt-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-700 mt-1 text-sm">
                      {course.description}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">
                        Duration: {course.duration}
                      </span>{" "}
                      |
                      <span className="text-gray-500">
                        {" "}
                        Level: {course.level}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">
                        Category: {course.category}
                      </span>{" "}
                      |
                      <span className="text-gray-500">
                        {" "}
                        Price: {course.price}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleApprove(course._id)}
                      className="border-2 border-red-700 font-bold text-red-700 shadow-2xl px-4 py-1 rounded-md transition-transform duration-300 hover:scale-110"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(course._id)}
                      className="border-2 border-red-700 font-bold text-red-700 shadow-2xl px-4 py-1 rounded-md transition-transform duration-300 hover:scale-110"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center items-center mt-4 mb-16">
        {pages >= 1 && (
          <div className="flex justify-center items-center">
            <Stack spacing={2}>
              <Pagination
                count={pages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  </div>
</>

  
  );
};

export default Permissions;
