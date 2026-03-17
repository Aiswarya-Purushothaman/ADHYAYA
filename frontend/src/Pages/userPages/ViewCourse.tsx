import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMycourses,
  updateSectionProgress,
  userFetchCourse,
} from "../../utils/Axios/api";
import Header from "./Header";
import { Course } from "../../utils/types";
import { ObjectId } from "mongoose";
import { toast } from "react-toastify";

const ViewCourse = () => {
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<Course | null | any>(null);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [progressUpdate,setProgressUpdate] = useState(false)
  const handleSection = (section: any, index: number) => {
    console.log(currentCourse);
    if (index === 0) {
      setSelectedSection(section);
    } else if (currentCourse.Sections[index - 1].progress >= 90) {
      setSelectedSection(section);
    } else {
      toast.warn("Watch prior video");
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await userFetchCourse();
        const res = await fetchMycourses();

        const MyCourse = response.data;
        const filteredCourse = MyCourse.find(
          (course: Course) => course._id.toString() === id
        );

        if (filteredCourse) {
          setSelectedSection(filteredCourse?.sections[0]);
          setView(filteredCourse);
        }

        const enrollments = res.data;
        enrollments.map((enrollment: any) => {
          if (enrollment?.courseId?._id === id) {
            setCurrentCourse(enrollment);
          }
        });
      } catch (error) {
        console.error("Error fetching course", error);
      }
    };

    fetchCourse();
  }, [id,progressUpdate]);

  const HandleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setCurrentTime(e.currentTarget.currentTime);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const progress = (currentTime / duration) * 100;

          const data = {
            courseId: view?._id as ObjectId,
            sectionId: selectedSection,
            progress: progress,
          };
          await updateSectionProgress(data);
          setProgressUpdate(!progressUpdate)
        } catch (error) {
          console.error("Error updating section progress:", error);
        }
      }, 2000);
    },
    [
      currentTime,
      duration,
      selectedSection,
      view?._id,
      updateSectionProgress,
      currentCourse,
    ]
  );
  const handleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    setDuration(event.currentTarget.duration);
  };

  if (!view) {
    return <div>Loading...</div>;
  }
  console.log(currentCourse, "currentCOurse ");
  return (
    <>
      <Header />
      <div className="container p-4 h-full overflow-y-auto">
        <div className="course-header mb-4">
          <h1 className="text-2xl font-bold mb-2">{view.title}</h1>
          <p className="text-lg mb-4">{view.description}</p>
        </div>
        {view.sections.length > 0 && (
          <div>
            <div className="video-container mb-4">
              <video
                key={selectedSection?.videoUrl}
                controls
                className="w-full h-96"
                onEnded={() => {}}
                onTimeUpdate={HandleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={selectedSection?.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="sections ">
              {view.sections.map((section: any, index: number) => (
                <div
                  key={index}
                  className="section p-2 border rounded mb-1 cursor-pointer"
                  onClick={() => handleSection(section, index)}
                >
                  <h2 className="text-xl font-semibold">
                    {section.videoTitle}
                  </h2>
                  <p>{section.videoDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center items-center mb-20">
          <div className="flex flex-col items-center gap-5">
            <h1 className="font-semibold text-xl text-zinc-800">Progress</h1>
            <div className="flex justify-center items-center w-96 h-10 p-5 bg-gradient-to-br from-red-600 to-pink-500 rounded-full shadow-lg relative">
              <div className="flex w-full bg-gray-200 h-2 rounded-md relative overflow-hidden">
                <div
                  className="bg-gradient-to-br from-red-400 to-pink-300 h-full rounded-md"
                  style={{ width: `${currentCourse?.progress}%` }}
                ></div>
                <div
                  className="absolute transform -translate-y-1/2 rounded-full bg-gradient-to-br from-red-600 to-pink-500 border-zinc-900"
                  style={{
                    width: "20px",
                    height: "25px",
                    left: `calc(${currentCourse?.progress}% - 10px)`,
                  }}
                ></div>
              </div>
            </div>
            <h1 className="font-semibold">
              {Math.round(currentCourse?.progress || 0)} %
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCourse;
