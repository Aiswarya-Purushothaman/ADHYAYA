import  { useState } from "react";
import Header from "./Header";


import {  Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FetchInstructors, } from "../../utils/Axios/api";
import { Instructor } from "../../utils/types";
const InstructorDetails = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<Instructor[] | any>([]);

 

  useEffect(() => {
    const fetchData = async () => {
      const instructor = await FetchInstructors();
      console.log(instructor, "instructor in frontend");
      if (instructor.data.length) {
        instructor.data.map((item: any) => {
          if (item._id === id) {
            setInstructor(item);
          }
        });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="flex overflow-y-hidden ">
     
        <div className="flex justify-center items-center w-full h-full    bg-gray-100">
          <div className="flex-1 flex justify-center items-center bg-white p-12">
            <div className="bg-white shadow-2xl rounded p-9 w-full max-w-md animate-dropIn">
            <button className=" p-2 rounded-lg bg-green-900 text-white">
<Link to={"/tutors"}>
              Back
              </Link>
</button>
              <h1 className="text-2xl font-semibold mb-6 text-center">
                Instructor Profile
              </h1>

             
              <div className="relative flex flex-col items-center mb-4">
                <img
                  src={instructor.profileImage
                    ? instructor.profileImage
                    :"https://via.placeholder.com/50"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4"
                />
              </div>
              <div className="mb-4 text-center ">
                <p className="font-medium mt-2">Name: {instructor?.name}</p>
                <p className=" font-medium mt-2">Email: {instructor?.email}</p>
              
                <p className=" font-medium mt-2">
                  Description: {instructor?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDetails;
