import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FetchCourses, UpdateCourse } from "../../utils/Axios/api";
import { Course } from "../../utils/types";
import { useError } from "./InstErrorBoundary";
import { toast } from "react-toastify";
import Axios from "axios";
import { validate } from "../../helpers/validate";
import CircularProgress from "@mui/material/CircularProgress";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const EditCourse = () => {
  const { id } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [showThumbnailInput, setShowThumbnailInput] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [sections, setSections] = useState<[] | any>([]);
  const [showVideoInputs, setShowVideoInputs] = useState<boolean[]>([]);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const throwError = useError();
  const navigate = useNavigate();
 console.log(sections,'sectionsss')
  useEffect(() => {
    const fetchCourseEdit = async () => {
      try {
        setIsLoading(true);
        const response = await FetchCourses();
        const mycourse = response.data;

        if (mycourse.length) {
          mycourse.forEach((item: any) => {
            if (item._id === id) {
              setSelectedCourse(item);
              setTitle(item.title);
              setDescription(item.description);
              setCategory(item.category);
              setLevel(item.level);
              setPrice(item.price);
              setDuration(item.duration);
              setThumbnail(item.thumbnail);
              setSections(item.sections || []);
              setShowVideoInputs(Array(item.sections.length).fill(false));
            }
          });
        }
        setIsLoading(false);
      } catch (error: any) {
        const message = error.response?.data?.message || "An error occurred";
        throwError(message);
        toast("Something went wrong");
      }
    };
    fetchCourseEdit();
  }, [id, throwError]);

  const handleVideoUpload = async (index: any, event: any) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("video/")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ADHYAYA");
      setIsLoading(true);

      try {
        const response = await Axios.post(
          "https://api.cloudinary.com/v1_1/dixhsgyfj/video/upload",
          formData
        );
        const sectionVideo = response.data.url;

        if (response.data.url) {
          setIsLoading(false);
        }
        const newSections = [...sections];
        newSections[index].videoUrl = sectionVideo;
        setSections(newSections);

        setErrors((prevErrors: any) => ({ ...prevErrors, video: "" }));
      } catch (error) {
        console.error("Video upload failed:", error);
        setIsLoading(false);
        setErrors((prevErrors: any) => ({ ...prevErrors, video: "Video upload failed" }));
      }
    } else {
      setErrors((prevErrors: any) => ({ ...prevErrors, video: "Please upload a valid video file" }));
    }
  };

  const handleImageUpload = async (event: any) => {
    setIsLoading(true);

    const file = event.target.files[0];

    if (!file) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        image: "Please upload an image file",
      }));
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (file && validImageTypes.includes(file.type)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ADHYAYA");
        const response = await Axios.post(
          "https://api.cloudinary.com/v1_1/dixhsgyfj/image/upload",
          formData
        );
        if (response.data.url) {
          setIsLoading(false);
        }
        const thumb = response.data.url;
        setThumbnail(thumb);

        setErrors((prevErrors: any) => ({ ...prevErrors, image: "" }));
      } catch (error) {
        console.error("Image upload failed:", error);
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          image: "Image upload failed",
        }));
      }
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        image: "Please upload a valid image file",
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validate(title, description, duration, price, sections);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    } else {
      try {
        const response = await UpdateCourse({ id, title, description, duration, price, category, level, thumbnail, sections });
        if (response.data) {
          toast.success("Course Update requested");
          navigate("/instructor/courses");
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;
        throwError(message);
      }
    }
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  return (
    <div className="p-6 w-full mx-auto h-full bg-white shadow-md rounded-md overflow-y-auto px-20">
      {selectedCourse && (
        <>
          <h1 className="text-2xl font-semibold mb-4">Edit Course</h1>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>
          <div className="mb-4 flex justify-content gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Course Category:
              </label>
              <select
                className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Production">Production</option>
                <option value="Services">Services</option>
                <option value="Finance">Finance</option>
                <option value="UI UX">UI UX</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Logistics">Logistics</option>
              </select>
              {errors.category && <p className="text-red-500">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Course Level:
              </label>
              <select
                className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && <p className="text-red-500">{errors.level}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Duration (in hours):
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.duration && <p className="text-red-500">{errors.duration}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Price:
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Course Thumbnail:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {thumbnail && <img src={thumbnail} alt="Course Thumbnail" className="w-32 h-32 mt-2" />}
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>




          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sections.map((section: any, index: number) => (
                    <Draggable key={section._id} draggableId={section._id} index={index}>
                      {(provided) => (
                        <div
                          className="mb-4 bg-gray-50 p-4 rounded-md"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold mb-2">
                              Section {index + 1} - {section?.videoTitle}
                            </h2>
                            <button
                              type="button"
                              onClick={() =>
                                setShowVideoInputs((prevInputs) => {
                                  const newInputs = [...prevInputs];
                                  newInputs[index] = !newInputs[index];
                                  return newInputs;
                                })
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded-md"
                            >
                              {showVideoInputs[index] ? "Hide" : "Edit"} Video
                            </button>
                          </div>
                          <div className="mb-2">
                            <label className="block text-gray-700 font-medium mb-1">
                              Section Title:
                            </label>
                            <input
                              type="text"
                              value={section.videoTitle}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].title = e.target.value;
                                setSections(newSections);
                              }}
                              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            {errors[`title_${index}`] && (
                              <p className="text-red-500">
                                {errors[`title_${index}`]}
                              </p>
                            )}
                          </div>
                          <div className="mb-2">
                            <label className="block text-gray-700 font-medium mb-1">
                              Section Description:
                            </label>
                            <textarea
                              value={section.videoDescription}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[index].description = e.target.value;
                                setSections(newSections);
                              }}
                              className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            ></textarea>
                            {errors[`description_${index}`] && (
                              <p className="text-red-500">
                                {errors[`description_${index}`]}
                              </p>
                            )}
                          </div>
                          {section.videoUrl && !showVideoInputs[index] && (
                            <div className="mb-2">
                              <label className="block text-gray-700 font-medium mb-1">
                                Existing Video:
                              </label>
                              <Link
                                to={section.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                Watch Video
                              </Link>
                            </div>
                          )}
                          {showVideoInputs[index] && (
                            <div className="mb-2">
                              <label className="block text-gray-700 font-medium mb-1">
                                Section Video:
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(event) =>
                                  handleVideoUpload(index, event)
                                }
                                className="w-full px-3 py-2 border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                              {errors.video && (
                                <p className="text-red-500">{errors.video}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>




          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            {isLoading ? <CircularProgress size={24} /> : "Update Course"}
          </button>
        </>
      )}
    </div>
  );
};

export default EditCourse;
