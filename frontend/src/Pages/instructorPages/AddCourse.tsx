import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstHeader from './instHeader';
import InstSideBar from './InstSideBar';
import Axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [categories, setCategories] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    courseTitle: '',
    courseDuration: '',
    coursePrice: '',
    courseLevel: '',
    categories: '',
    description: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event:any) => {
    setIsLoading(true)

    const file = event.target.files[0];
    console.log(file, "filefile");
  
    if (!file) {
      setErrors((prevErrors) => ({ ...prevErrors, image: 'Please upload an image file' }));
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
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
        console.log(thumb, "thumbthumb");
        setImage(thumb);

        setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
      } catch (error) {
        console.error('Image upload failed:', error);
        setErrors((prevErrors) => ({ ...prevErrors, image: 'Image upload failed' }));
      }
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, image: 'Please upload a valid image file' }));
    }
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    const newErrors = {
      courseTitle: '',
      courseDuration: '',
      coursePrice: '',
      courseLevel: '',
      categories: '',
      description: '',
      image: '',
    };
    let valid = true;

    if (!courseTitle.trim()) {
      newErrors.courseTitle = 'Title cannot be empty or only spaces';
      valid = false;
    } 
    if (!description || !/^[a-zA-Z0-9\s.,&\-\/+:]+$/.test(description)) {
      newErrors.description = 'Description should only contain alphabets, numbers, spaces, and the characters . , & - / + :';
      valid = false;
    }
    if (!courseDuration || !/^\d+$/.test(courseDuration)) {
      newErrors.courseDuration = 'Duration should be a number';
      valid = false;
    }
    if (!coursePrice || !/^\d+$/.test(coursePrice)) {
      newErrors.coursePrice = 'Price should be a number';
      valid = false;
    }
    if (!courseLevel) {
      newErrors.courseLevel = 'Please select a course level';
      valid = false;
    }
    if (!categories) {
      newErrors.categories = 'Please select a category';
      valid = false;
    }

    if (!image) {
      newErrors.image = 'Please upload a thumbnail image';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const courseDetails = { courseTitle, description, courseDuration, coursePrice, courseLevel, categories, image };
        localStorage.setItem("courseDetails", JSON.stringify(courseDetails));
        navigate("/instructor/addcourse2");
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
      console.log('Form submitted successfully');
    } else {
      console.log('Form has errors:', newErrors);
    }
  };

  return (
    <>
      <InstHeader />
      <div className="flex h-full">
        <InstSideBar />
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto mb-20 mt-5 p-8 bg-white shadow-md rounded-lg border-1">
            <h1 className="text-2xl font-bold mb-2">
              Add Course
              <p className="text-sm">Step 1</p>
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Course Title:</label>
                <input
                  type="text"
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
                {errors.courseTitle && (
                  <p className="text-red-500 text-sm">{errors.courseTitle}</p>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-500 mb-1">Description:</label>
                <textarea
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
              <div className="flex justify-between gap-2 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-500 mb-1">Course Duration In Hours:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                  />
                  {errors.courseDuration && (
                    <p className="text-red-500 text-sm">{errors.courseDuration}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-500 mb-1">Course Price:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                  />
                  {errors.coursePrice && (
                    <p className="text-red-500 text-sm">{errors.coursePrice}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between gap-2 mb-4">
                <div className="flex-1">
                  <label className="block text-gray-500 mb-1">Course Level:</label>
                  <select
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                  >
                    <option value=""></option>
                    <option value="beginner">Easy</option>
                    <option value="intermediate">Medium</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.courseLevel && (
                    <p className="text-red-500 text-sm">{errors.courseLevel}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-500 mb-1">Categories:</label>
                  <select
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                  >
                    <option value=""></option>
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
                  {errors.categories && (
                    <p className="text-red-500 text-sm">{errors.categories}</p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 mb-2">Thumbnail:</label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  id="imageInput"
                  ref={imageInputRef}
                  className="w-full text-gray-500 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  onChange={handleImageUpload}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
                {image && (
                  <img
                    src={image}
                    alt="Thumbnail Preview"
                    className="mt-4 w-24 h-24 object-cover"
                  />
                )}
              </div>
              {!isLoading?(
                <button
                type="submit"
                className="mx-72 bg-gradient-to-br from-red-600 to-pink-500 text-white px-9 py-1 rounded-lg hover:text-black transition-transform duration-300 hover:scale-110"
              >
                Next
              </button>
              ):(
                <div className="flex justify-center mb-4">
                <CircularProgress />
              </div>
              )}
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourse;
