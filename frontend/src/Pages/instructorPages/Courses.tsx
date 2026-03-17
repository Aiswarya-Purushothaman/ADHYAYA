import React, { useEffect, useState } from "react";
import InstHeader from "./instHeader";
import InstSideBar from "./InstSideBar";
import { FetchCourses } from "../../utils/Axios/api";
import { toast } from "react-toastify";
import { Course } from "../../utils/types";
import CourseDetails from "./CourseDetails";
import { useError } from "./InstErrorBoundary";
import { MdEditDocument } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";


const Courses = () => {
  const [requestedCourses, setRequestedCourses] = useState<Course[]>([]);
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [rejectedCourses, setRejectedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<string>("requested");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
const navigate=useNavigate()
const throwError=useError()

  useEffect(() => {
    const RequestedCourse = async () => {
      try {
        const response = await FetchCourses();
        const MyCourse = response.data;
        console.log(MyCourse, "in frontend");

        const requested = MyCourse.filter((course) => course.isApproved === "pending");
        const approved = MyCourse.filter((course) => course.isApproved === "approved");
        const rejected = MyCourse.filter((course) => course.isApproved === "rejected");

        setRequestedCourses(requested);
        setApprovedCourses(approved);
        setRejectedCourses(rejected);
      } catch (error:any) {
      
        const message=error?.response?.data?.message
     
          throwError(message)
        toast.error("Something went wrong");
      }
    };

    RequestedCourse();
  }, []);

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
    }

    return (
      <div className={`absolute top-0 left-0 ${bgColor} text-white text-xs font-bold px-2 py-1 rounded-tr rounded-br`}>
        {text}
      </div>
    );
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };


  const renderCourses = (courses: Course[], type: string) => (
    courses.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 animate-dropIn">
        {courses.map((course, index) => (
          <div key={index} className="w-64 p-4 shadow-lg rounded-lg border relative flex flex-col justify-between">
            {renderSticker(type)}
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
            <div className="flex justify-content gap-3 mx-10">
            <button
              onClick={() => handleViewDetails(course)}
              className="bg-gradient-to-br from-red-600 to-pink-500 text-white mt-4 w-28  py-2 rounded transition-transform duration-300 hover:scale-110"
            >
              View Details
            </button>
            <button
            
              className="bg-gradient-to-br from-red-600 to-pink-500 text-white mt-4 px-2  py-2 rounded transition-transform duration-300 hover:scale-110"
            >
               <Link to={`/instructor/editCourse/${course._id}`}>
               <MdEditDocument/>
               </Link>
              
            </button>
            </div>
          
          </div>
        ))}
      </div>
    ) : (
      <div className="flex justify-center items-center h-full">
        No courses found in the {type} tab.
      </div>
    )
  );
  


  return (
    <>
      <InstHeader />
      <div className="flex h-screen overflow-hidden">
        <InstSideBar />
        <div className="flex-grow flex flex-col mb-20 p-10">
          {selectedCourse ? (
            <CourseDetails course={selectedCourse} onCancel={handleBack} />
          ) : (
            <>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  className={`px-4 py-2 ${activeTab === "requested" ? "bg-yellow-500 text-white" : "bg-gray-200"} rounded-lg transition-transform duration-300 hover:scale-110`}
                  onClick={() => handleTabClick("requested")}
                >
                  Requested
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "approved" ? "bg-green-500 text-white" : "bg-gray-200"} rounded-lg transition-transform duration-300 hover:scale-110`}
                  onClick={() => handleTabClick("approved")}
                >
                  Approved
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"} rounded-lg transition-transform duration-300 hover:scale-110`}
                  onClick={() => handleTabClick("rejected")}
                >
                  Rejected
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {activeTab === "requested" && renderCourses(requestedCourses, "requested")}
                {activeTab === "approved" && renderCourses(approvedCourses, "approved")}
                {activeTab === "rejected" && renderCourses(rejectedCourses, "rejected")}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;

