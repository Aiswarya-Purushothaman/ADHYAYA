import React, { useState } from "react";
import { Course } from "../../utils/types";
import { MdOutlineOndemandVideo, MdExpandMore, MdExpandLess } from "react-icons/md";
import { Link } from "react-router-dom";
import '../../style/home.css';
import Review from "./Review";

type CourseDetailsProps = {
  course: Course;
  onCancel: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onCancel }) => {
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    if (openSectionIndex === index) {
      setOpenSectionIndex(null);
    } else {
      setOpenSectionIndex(index); 
    }
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-xl w-full min-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onCancel} className="bg-gradient-to-br from-red-600 to-pink-500 transition-transform duration-300 hover:scale-110 text-white font-semibold px-4 py-2 rounded mb-2">
          Go Back
        </button>
      </div>
      <div className="flex animate-dropIn">
        <div className="w-1/2 pr-4">
          <img src={course.thumbnail} alt={course.title} className="w-60 h-48 rounded-lg mb-2" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="mb-2">
              <span className="text-sm text-gray-500">Duration: {course.duration}</span> |{" "}
              <span className="text-sm text-gray-500">Level: {course.level}</span>
            </div>
            <div className="mb-2">
              <span className="text-sm text-gray-500">Category: {course.category}</span> |{" "}
              <span className="text-sm text-gray-500">Price: ₹{course.price}</span>
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Course Sections</h3>
            {course.sections.map((section, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center justify-between bg-gradient-to-br from-red-600 to-pink-500 gap-2 px-3 border-4 border-gray-300 h-12 rounded-lg mb-2 transition-transform duration-300 hover:scale-110">
                  <div className="p-1 rounded-lg shadow-sm flex w-full items-center">
                    <div className="flex justify-between w-full">
                      <h2 className="text-sm text-white font-semibold">{section.videoTitle}</h2>
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
                      <Link
                        to={section.videoUrl}
                        className="text-white underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdOutlineOndemandVideo className="text-white h-7 w-10 ml-2 transition-transform duration-300 hover:scale-110" />
                      </Link>
                    </div>
                  </div>
                </div>
                {openSectionIndex === index && (
                  <p className="text-gray-700 mb-4 ml-8">{section.videoDescription}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Review course={course}/>
    </div>
  );
};

export default CourseDetails;
