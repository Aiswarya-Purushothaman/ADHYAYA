import React, { useEffect, useState } from "react";
import { Course, Instructor } from "../../utils/types";
import { fetchInstructor, fetchMycourses } from "../../utils/Axios/api";
import {
  MdOutlineOndemandVideo,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import Review from "./Review";
import { useError } from "./ErrorBoundary";
import { ObjectId } from "mongoose";

type CourseDetailsProps = {
  course: Course;
  onCancel: () => void;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onCancel }) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState(
    course.sections.map((section) => ({ ...section, showDescription: false }))
  );
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);
  const throwError = useError();
  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        const response = await fetchInstructor({ id: course.instructorId });
        setInstructor(response.data);
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
        setError("Failed to fetch instructor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (course.instructorId) {
      fetchInstructorDetails();
    }
  }, [course.instructorId]);

  useEffect(() => {

    const FetchMyUserCourse = async () => {
      try {
        const response = await fetchMycourses();

        console.log(response.data, "enrolled courses");
  
      } catch (error: any) {
        const message = error?.response?.data?.message;
        console.log(error, "error");
        throwError(message);
      }
    };

    FetchMyUserCourse();
  }, []);

  const toggleSection = (index: number) => {
    if (openSectionIndex === index) {
      setOpenSectionIndex(null);
    } else {
      setOpenSectionIndex(index);
    }
  };

  if (loading) {
    return <p>Loading instructor details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="overflow bg-white p-5 rounded-lg  shadow-xl w-full h-screen mb-20 ">
      <div className="flex justify-between items-center mb-4 animate-dropIn">
        <button
          onClick={onCancel}
          className="bg-gradient-to-br from-red-600 to-pink-500 transition-transform duration-300 hover:scale-110 text-white font-semibold px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>

      <div className="flex">
        <div className="w-1/2 pr-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-72 h-60 rounded-lg mb-4 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                Duration: {course.duration}
              </span>{" "}
              |{" "}
              <span className="text-sm text-gray-500">
                Level: {course.level}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                Category: {course.category}
              </span>{" "}
              |{" "}
              <span className="text-sm text-gray-500">
                Price: ₹{course.price}
              </span>
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Instructor Details</h3>
            {instructor ? (
              <div className="flex items-center">
                <img
                  src={instructor.profileImage}
                  alt={instructor.name}
                  className="w-20 h-20 object-cover rounded-full mr-4"
                />
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Name:</span>{" "}
                    {instructor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Description:</span>{" "}
                    {instructor.description}
                  </p>
                </div>
              </div>
            ) : (
              <p>No instructor details found.</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Course Sections</h3>
            {sections.map((section, index) => (
              <div key={index}>
                <div className="flex w-full bg-gradient-to-br from-red-600 to-pink-500 gap-2 px-3 border-4 border-gray-300 h-auto rounded-lg mb-2 transition-transform duration-300 hover:scale-110">
                  <div className="p-1 rounded-lg shadow-sm flex items-center w-full">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm text-white font-semibold">
                          {section.videoTitle}
                        </h2>
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleSection(index)}
                        >
                          {openSectionIndex === index ? (
                            <MdExpandLess className="text-white h-6 w-6 ml-2" />
                          ) : (
                            <MdExpandMore className="text-white h-6 w-6 ml-2" />
                          )}
                        </div>
                      </div>
                      <MdOutlineOndemandVideo className="text-white h-7 w-10 cursor-pointer" />
                    </div>
                  </div>
                </div>
                {openSectionIndex === index && (
                  <div className="bg-gray-100 p-2 rounded-lg mb-2 animate-dropIn">
                    <p className="text-gray-800">{section.videoDescription}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Review course={course} />
    </div>
  );
};

export default CourseDetails;
