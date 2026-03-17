import  { useEffect, useState } from "react";
import Header from "./Header";
import SidebarAdmin from "./SidebarAdmin";
import { fetchAllcourses } from "../../utils/Axios/api";
import { toast } from "react-toastify";
import { Course } from "../../utils/types";
import CourseDetails from "./CourseDetails";

const Courses = () => {
  const [requestedCourses, setRequestedCourses] = useState<Course[]>([]);
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [rejectedCourses, setRejectedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<string>("requested");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const RequestedCourse = async () => {
      try {
        const response = await fetchAllcourses();
        const MyCourse = response.data;
        console.log(MyCourse, "in frontend");

        const requested = MyCourse.filter((course: { isApproved: string; }) => course.isApproved === "pending");
        const approved = MyCourse.filter((course: { isApproved: string; }) => course.isApproved === "approved");
        const rejected = MyCourse.filter((course: { isApproved: string; }) => course.isApproved === "rejected");

        setRequestedCourses(requested);
        setApprovedCourses(approved);
        setRejectedCourses(rejected);
      } catch (error:any) {
        console.error(error.message);
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
      <button
        onClick={() => handleViewDetails(course)}
        className="bg-gradient-to-br from-red-600 to-pink-500 text-white mt-4 w-28 mx-14 py-2 rounded transition-transform duration-300 hover:scale-110"
      >
        View Details
      </button>
    </div>
  ))}
</div>

  );

  return (
   <>
  <Header />
  <div className="flex h-screen overflow-hidden">
    <SidebarAdmin />
    <div className="flex-grow flex flex-col mb-20 p-10">
      {selectedCourse ? (
        <CourseDetails course={selectedCourse} onCancel={handleBack} />
      ) : (
        <>
          <div className="flex justify-center gap-2 mt-3">
            <button
              className={`px-4 py-2 ${
                activeTab === "requested" ? "bg-yellow-500 text-white" : "bg-gray-200"
              } rounded-lg transition-transform duration-300 hover:scale-110`}
              onClick={() => handleTabClick("requested")}
            >
              Requested
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "approved" ? "bg-green-500 text-white" : "bg-gray-200"
              } rounded-lg transition-transform duration-300 hover:scale-110`}
              onClick={() => handleTabClick("approved")}
            >
              Approved
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "rejected" ? "bg-red-500 text-white" : "bg-gray-200"
              } rounded-lg transition-transform duration-300 hover:scale-110`}
              onClick={() => handleTabClick("rejected")}
            >
              Rejected
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {activeTab === "requested" && (
              <>
                {requestedCourses.length > 0 ? (
                  renderCourses(requestedCourses, "requested")
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No courses found in the requested tab.
                  </div>
                )}
              </>
            )}
            {activeTab === "approved" && (
              <>
                {approvedCourses.length > 0 ? (
                  renderCourses(approvedCourses, "approved")
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No courses found in the approved tab.
                  </div>
                )}
              </>
            )}
            {activeTab === "rejected" && (
              <>
                {rejectedCourses.length > 0 ? (
                  renderCourses(rejectedCourses, "rejected")
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No courses found in the rejected tab.
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  </div>
</>

  );
};

export default Courses;
