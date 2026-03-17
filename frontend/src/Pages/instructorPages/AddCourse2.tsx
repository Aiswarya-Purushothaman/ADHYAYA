import React, { useEffect, useRef, useState } from "react";
import InstHeader from "./instHeader";
import InstSideBar from "./InstSideBar";
import { toast } from "react-toastify";
import Axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Addcourse } from "../../utils/Axios/api";
import { setInstructorDetails } from "../../utils/redux/slices/instructorAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useError } from "./InstErrorBoundary";
import  {Queue}  from "../../utils/queue.ts";



const AddCourse2 = () => {
  const throwError=useError()

  class Queue<T> {
    private items: T[] = [];
  
    enqueue(item: T) {
      this.items.push(item);
      console.log("Item added to queue:", item);
      console.log("Current queue:", this.items);
    }
  
    dequeue(): T | undefined {
      return this.items.shift();
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    toArray(): T[] {
      return [...this.items];
    }
  }
  
  const [sections, addSections] = useState<any>([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [errors, setErrors] = useState({
    chapterTitle: "",
    description: "",
    video: "",
  });
  const [sectionsQueue] = useState(new Queue<{ title: string, description: string, videoURL: string }>()); 
  const dispatch=useDispatch()
  const navigate=useNavigate()

 

  const [isLoading, setIsLoading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (event: any) => {
    const file = event.target.files[0];
    console.log(file, "filefile");

    if (file && file.type.startsWith("video/")) {
      setVideo(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ADHYAYA");
      setIsLoading(true);
      const response = await Axios.post(
        "https://api.cloudinary.com/v1_1/dixhsgyfj/video/upload",
        formData
      );
      if (response.data.url) {
        setIsLoading(false);
      }
      const sectionVideo = response.data.url;
      console.log(sectionVideo, "thumbthumb");
      setVideo(sectionVideo);
      setErrors({ ...errors, video: "" });
    } else {
      setErrors({ ...errors, video: "Please upload a valid video file" });
    }
  };

  
  const handleSection = async (e: any) => {
    e.preventDefault();
    const newErrors = {
      chapterTitle: '',
      description: '',
      video: '',
    };
    let valid = true;

    if (!chapterTitle || !/^[a-zA-Z\s\(\)\-\.]+$/.test(chapterTitle)) {
      newErrors.chapterTitle = 'Chapter title should only contain alphabets and spaces';
      valid = false;
    }
    if (!description || !/^[a-zA-Z\s]+$/.test(description)) {
      newErrors.description = 'Description should only contain alphabets and spaces';
      valid = false;
    }
    if (!video) {
      newErrors.video = 'Please upload a video file';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const chapter = {
        title: chapterTitle,
        description: description,
        videoURL: video || '', 
      };

      try {
        sectionsQueue.enqueue(chapter);
        console.log(sectionsQueue.toArray(), 'sections after update');

        setChapterTitle('');
        setDescription('');
        setVideo(null);
        if (videoInputRef.current) {
          videoInputRef.current.value = '';
        }
        console.log(sectionsQueue.toArray(), 'queue after section added');

        toast.success('Section added successfully');
      } catch (error) {
        console.log('Error adding section:', error);
      }
    } else {
      console.log('Form has errors:', newErrors);
    }
  };


  const handleSubmit = async (event: any) => {
    try {
      if (sectionsQueue.isEmpty()) {
        console.log(sectionsQueue, 'sections in here');
        toast.error('Add at least one chapter');
        return;
      }
      console.log(sectionsQueue, 'sections is not emppty');
      const courseDetails = localStorage.getItem('courseDetails');
      if (courseDetails) {
        const parsedDetails = JSON.parse(courseDetails);
        parsedDetails.sections = sectionsQueue.toArray();
        localStorage.setItem('courseDetails', JSON.stringify(parsedDetails));

        const response = await Addcourse(parsedDetails);
        if (response) {
          dispatch(setInstructorDetails(response.data));
          localStorage.removeItem('courseDetails');
          toast.success('Course Requested Successfully');
          navigate('/instructor/courses');
        }
      }
    } catch (error: any) {
      const message = error.response.data.message;
      console.log(error, 'erorrorororr');
      throwError(message);
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    console.log(sections, "sections in useEffect");
  }, [sections]);

  return (
    <>
      <InstHeader />
      <div className="flex h-full">
        <InstSideBar />
        <div className="flex-1 overflow-auto max-w-full h-full mx-auto p-14">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form>
              <h1 className="text-2xl font-bold mb-1">Sections</h1>
              <div className="mb-6">
                <h2 className="text-sm font-bold mb-3">Step-2</h2>
                <div className="mb-4">
                  <label className="block text-m text-gray-500 mb-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    id="chapterTitle"
                    placeholder="Enter chapter title"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                  />
                  {errors.chapterTitle && (
                    <p className="text-red-500 text-sm">
                      {errors.chapterTitle}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-500 mb-1">
                    Description:
                  </label>
                  <textarea
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-m text-gray-500 mb-1">
                    Upload Video
                  </label>
                  <input
                    type="file"
                    id="chapterVideo"
                    accept="video/*"
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-pink-500"
                    onChange={handleVideoUpload}
                    ref={videoInputRef}
                  />
                  {errors.video && (
                    <p className="text-red-500 text-sm">{errors.video}</p>
                  )}
                </div>
                <div className="flex mt-9 justify-between">
                  {/* <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
                >
                  {"<<"}Back
                </button> */}
                  {isLoading ? (
                    <div className="flex justify-center mb-4">
                      <CircularProgress />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 transition-transform duration-300 hover:scale-110"
                      onClick={handleSection}
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            </form>
            {isLoading === false ? (
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSubmit}
                  className="mt-4 w-64 font-semibold px-4 py-2 bg-gradient-to-br from-red-600 to-pink-500 text-white rounded focus:border-pink-500 transition-transform duration-300 hover:scale-110"
                >
                  Request Permission
                </button>
              </div>
            ) : (
              " "
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourse2;
